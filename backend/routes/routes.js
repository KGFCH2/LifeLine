import express from 'express';
import { googleMapsGet } from '../lib/googleMaps.js';

const router = express.Router();

router.get('/emergency', async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng } = req.query;
    if (!originLat || !originLng || !destLat || !destLng) {
      return res.status(400).json({ error: 'Origin and destination coordinates required' });
    }

    const origin = `${originLat},${originLng}`;
    const destination = `${destLat},${destLng}`;

    const data = await googleMapsGet('/directions/json', {
      origin,
      destination,
      alternatives: true,
      departure_time: 'now',
      traffic_model: 'best_guess',
      mode: 'driving',
      region: 'in'
    });

    console.log('--- Google Directions API Response ---');
    console.log('Status:', data.status);
    if (data.error_message) console.log('Error Message:', data.error_message);
    console.log('--------------------------------------');

    if (data.status !== 'OK') {
      return res.status(502).json({ 
        error: 'Directions API error', 
        details: data.status,
        message: data.error_message || 'No additional details'
      });
    }

    const routes = (data.routes || [])
      .map((route, index) => {
        const leg = route.legs[0] || {};
        return {
          originalIndex: index,
          summary: route.summary || `Route ${index + 1}`,
          distance: leg.distance?.text,
          distanceValue: leg.distance?.value,
          duration: leg.duration?.text,
          durationValue: leg.duration?.value,
          durationInTraffic: leg.duration_in_traffic?.text || leg.duration?.text,
          durationInTrafficValue: leg.duration_in_traffic?.value || leg.duration?.value,
          trafficStatus: getTrafficStatus(leg.duration_in_traffic?.value, leg.duration?.value),
          polyline: route.overview_polyline?.points,
          steps: leg.steps?.map(step => ({
            instruction: stripHtml(step.html_instructions || ''),
            distance: step.distance?.text,
            duration: step.duration?.text,
            start: step.start_location,
            end: step.end_location,
            travelMode: step.travel_mode
          })) || [],
          warnings: route.warnings || []
        };
      })
      .sort((a, b) => (a.durationInTrafficValue || a.durationValue || Infinity) - (b.durationInTrafficValue || b.durationValue || Infinity))
      .map((route, index) => ({
        ...route,
        id: index,
        fastest: index === 0
      }));

    res.json({
      origin: { lat: parseFloat(originLat), lng: parseFloat(originLng) },
      destination: { lat: parseFloat(destLat), lng: parseFloat(destLng) },
      routes,
      fastestRoute: routes[0] || null,
      routeCount: routes.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Routes error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to calculate emergency routes', details: error.details });
  }
});

router.get('/traffic', async (req, res) => {
  try {
    const { lat, lng, radius = 2000 } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng are required' });
    const offset = Number(radius) / 111320;
    const data = await googleMapsGet('/distancematrix/json', {
      origins: `${lat},${lng}`,
      destinations: `${Number(lat) + offset},${lng}|${lat},${Number(lng) + offset}`,
      departure_time: 'now',
      traffic_model: 'best_guess',
      mode: 'driving',
      region: 'in'
    });
    res.json({ ...data, center: { lat: Number(lat), lng: Number(lng) }, radius: Number(radius) });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch traffic data', details: error.details });
  }
});

function getTrafficStatus(trafficDuration, normalDuration) {
  if (!trafficDuration || !normalDuration) return 'unknown';
  const ratio = trafficDuration / normalDuration;
  if (ratio > 2) return 'heavy';
  if (ratio > 1.3) return 'moderate';
  return 'light';
}

function stripHtml(value) {
  return value.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

export default router;
