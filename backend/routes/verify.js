import express from 'express';
import fetch from 'node-fetch';
import { saveDocument } from '../lib/firebaseAdmin.js';

const router = express.Router();

router.post('/civilian', async (req, res) => {
  try {
    const { vehicleNumber, purpose, contact, location, destination } = req.body;

    if (!vehicleNumber || !purpose || !contact) {
      return res.status(400).json({ error: 'vehicleNumber, purpose, and contact are required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });

    const prompt = `Evaluate this civilian emergency vehicle request for India.
Vehicle: ${vehicleNumber}
Purpose: ${purpose}
Contact: ${contact}
Location: ${JSON.stringify(location)}

Respond ONLY with a JSON object in this exact format:
{
  "approved": true/false,
  "confidence": 0.0-1.0,
  "reason": "short reason",
  "riskLevel": "low/medium/high",
  "suggestedPriority": "normal/high/critical",
  "verificationNotes": "any concerns or approvals"
}

Be strict. Approve only if purpose is clearly medical emergency, hospital transport, or life-critical.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const geminiData = await geminiRes.json();
    if (!geminiRes.ok) {
      return res.status(502).json({ error: 'Gemini verification failed', details: geminiData?.error?.message || geminiRes.statusText });
    }

    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    let result;
    try {
      const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(clean);
    } catch (e) {
      result = {
        approved: false,
        confidence: 0.2,
        reason: 'AI response could not be parsed safely',
        riskLevel: 'high',
        suggestedPriority: 'normal',
        verificationNotes: 'Manual emergency services should be contacted immediately'
      };
    }

    const approved = result.approved === true;
    const tempVehicleId = `CIV-${Date.now()}`;

    const verification = {
      verified: approved,
      tempVehicleId,
      vehicleNumber,
      purpose,
      contact,
      location,
      destination,
      aiResult: result,
      createdAt: new Date().toISOString()
    };

    await saveDocument('civilianVerifications', tempVehicleId, verification);

    res.json({
      verified: approved,
      tempVehicleId,
      vehicleNumber,
      purpose,
      contact,
      aiResult: result,
      permissions: approved ? {
        emergencyTracking: true,
        routePriority: true,
        policeAlert: true,
        validityHours: 6
      } : null,
      message: approved
        ? 'Civilian mode activated. You have temporary emergency vehicle status.'
        : 'Request not approved. Please book an official ambulance or provide more details.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Civilian verify error:', error);
    res.status(500).json({ error: 'Verification failed', details: error.message });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });

    const prompt = `You are LifeLine+ AI, an emergency response assistant for India.
Keep advice concise, practical, and safe. Encourage calling 108/112 for serious emergencies.
Context: ${JSON.stringify(context || {})}
User: ${message}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const geminiData = await geminiRes.json();
    if (!geminiRes.ok) {
      return res.status(502).json({ error: 'Gemini chat failed', details: geminiData?.error?.message || geminiRes.statusText });
    }

    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || 'Stay calm. If this is life-threatening, call 108 or 112 immediately.';
    res.json({ text, model: 'gemini-1.5-flash', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'AI chat failed', details: error.message });
  }
});

export default router;
