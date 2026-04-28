import fetch from 'node-fetch';

const GOOGLE_MAPS_BASE_URL = 'https://maps.googleapis.com/maps/api';

export function requireGoogleMapsKey() {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    const error = new Error('GOOGLE_MAPS_API_KEY is not configured');
    error.status = 500;
    throw error;
  }
  return key;
}

export async function googleMapsGet(path, params = {}) {
  const key = requireGoogleMapsKey();
  const url = new URL(`${GOOGLE_MAPS_BASE_URL}${path}`);

  Object.entries({ ...params, key }).forEach(([name, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(name, value);
    }
  });

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(`Google Maps request failed with HTTP ${response.status}`);
    error.status = 502;
    error.details = data;
    throw error;
  }

  return data;
}

export async function nearbySearch({ lat, lng, type, radius = 5000, keyword }) {
  const data = await googleMapsGet('/place/nearbysearch/json', {
    location: `${lat},${lng}`,
    radius,
    type,
    keyword
  });

  if (!['OK', 'ZERO_RESULTS'].includes(data.status)) {
    const error = new Error('Google Places API error');
    error.status = 502;
    error.details = data.status;
    throw error;
  }

  return data.results || [];
}

export async function placeDetails(placeId, fields) {
  const data = await googleMapsGet('/place/details/json', {
    place_id: placeId,
    fields
  });

  if (data.status !== 'OK') {
    const error = new Error('Place not found');
    error.status = 404;
    error.details = data.status;
    throw error;
  }

  return data.result;
}

export function normalizePlace(place, origin) {
  const location = place.geometry?.location || null;
  const distance = location && origin
    ? calculateDistance(origin.lat, origin.lng, location.lat, location.lng)
    : null;

  return {
    id: place.place_id,
    name: place.name,
    location,
    address: place.vicinity || place.formatted_address || '',
    rating: place.rating || null,
    totalRatings: place.user_ratings_total || 0,
    openNow: place.opening_hours?.open_now ?? null,
    businessStatus: place.business_status || 'UNKNOWN',
    types: place.types || [],
    photoReference: place.photos?.[0]?.photo_reference || null,
    distance
  };
}

export function googlePhotoUrl(photoReference, maxWidth = 400) {
  if (!photoReference) return null;
  const key = requireGoogleMapsKey();
  return `${GOOGLE_MAPS_BASE_URL}/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${key}`;
}

export function calculateDistance(lat1, lng1, lat2, lng2) {
  const aLat = Number(lat1);
  const aLng = Number(lng1);
  const bLat = Number(lat2);
  const bLng = Number(lng2);

  if (![aLat, aLng, bLat, bLng].every(Number.isFinite)) return null;

  const earthRadiusKm = 6371;
  const dLat = toRadians(bLat - aLat);
  const dLng = toRadians(bLng - aLng);
  const haversine = Math.sin(dLat / 2) ** 2
    + Math.cos(toRadians(aLat)) * Math.cos(toRadians(bLat)) * Math.sin(dLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}
