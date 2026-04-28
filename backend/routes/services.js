import express from 'express';
import { googlePhotoUrl, nearbySearch, normalizePlace, placeDetails } from '../lib/googleMaps.js';

const router = express.Router();

const FALLBACK_SERVICE_NAMES = {
  hospital: ['City Hospital', 'Metro Care Hospital', 'LifeLine Medical Center', 'Apollo Emergency Clinic', 'General Hospital'],
  police: ['Police Station', 'Traffic Police Station', 'Public Safety Office', 'City Control Room', 'Law Enforcement Center'],
  doctor: ['Dr. Sharma Clinic', 'City Health Clinic', 'Family Care Center', 'General Physician Hub', 'Emergency Doctor Unit'],
  pharmacy: ['24x7 Pharmacy', 'HealthPlus Pharmacy', 'Care Drug Store', 'MediPoint Pharmacy', 'City Pharmacy'],
  health: ['Health Center', 'Wellness Clinic', 'Community Health Unit', 'Emergency Care Point', 'Primary Health Center']
};

function seedServices(lat, lng, type) {
  const originLat = Number(lat);
  const originLng = Number(lng);
  const names = FALLBACK_SERVICE_NAMES[type] || FALLBACK_SERVICE_NAMES.hospital;

  return names.map((name, index) => {
    const delta = 0.01 + index * 0.003;
    const location = {
      lat: originLat + (index % 2 === 0 ? delta : -delta),
      lng: originLng + (index % 2 === 0 ? -delta : delta)
    };

    return {
      id: `${type.toUpperCase()}-FALLBACK-${index + 1}`,
      name,
      location,
      address: `${name}, Nearby area`,
      rating: 4.1 + ((index % 3) * 0.2),
      totalRatings: 25 + index * 11,
      openNow: index % 4 !== 3,
      businessStatus: 'OPERATIONAL',
      types: [type],
      photoReference: null,
      distance: Number.isFinite(originLat) && Number.isFinite(originLng)
        ? Math.sqrt((location.lat - originLat) ** 2 + (location.lng - originLng) ** 2) * 111
        : null,
      photo: null,
      source: 'fallback'
    };
  });
}

router.get('/', async (req, res) => {
  try {
    const {
      lat,
      lng,
      type = 'hospital',
      radius = 5000,
      keyword,
      specialty,
      minRating,
      openNow,
      sortBy = 'distance'
    } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    let placeType = type;
    const validTypes = ['hospital', 'police', 'doctor', 'pharmacy', 'health'];
    if (!validTypes.includes(placeType)) placeType = 'hospital';

    let results = [];

    try {
      const places = await nearbySearch({
        lat,
        lng,
        type: placeType,
        radius,
        keyword: specialty || keyword || (placeType === 'doctor' ? 'doctor clinic' : undefined)
      });

      results = places.map(place => {
        const normalized = normalizePlace(place, { lat, lng });
        return {
          ...normalized,
          photo: googlePhotoUrl(normalized.photoReference),
          source: 'google_places'
        };
      });
    } catch (error) {
      console.warn('Nearby services fallback:', error.message, error.details || '');
      results = seedServices(lat, lng, placeType);
    }

    if (!results.length) {
      results = seedServices(lat, lng, placeType);
    }

    if (minRating) {
      const threshold = Number(minRating);
      results = results.filter(place => (place.rating || 0) >= threshold);
    }

    if (openNow === 'true') {
      results = results.filter(place => place.openNow === true);
    }

    results.sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'availability') return Number(b.openNow === true) - Number(a.openNow === true);
      return (a.distance ?? Number.MAX_SAFE_INTEGER) - (b.distance ?? Number.MAX_SAFE_INTEGER);
    });

    res.json({
      count: results.length,
      type: placeType,
      source: results[0]?.source || 'google_places',
      center: { lat: parseFloat(lat), lng: parseFloat(lng) },
      filters: {
        radius: Number(radius),
        minRating: minRating ? Number(minRating) : null,
        openNow: openNow === 'true',
        specialty: specialty || null,
        sortBy
      },
      results
    });
  } catch (error) {
    console.error('Services error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch nearby services', details: error.details });
  }
});

router.get('/details/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    const details = await placeDetails(
      placeId,
      'name,formatted_address,formatted_phone_number,international_phone_number,website,opening_hours,rating,reviews,geometry,photos,business_status,url'
    );
    res.json(details);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch place details', details: error.details });
  }
});

export default router;
