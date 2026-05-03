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

    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    let result;
    let geminiRes;
    try {
      geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const geminiData = await geminiRes.json();
      
      if (!geminiRes.ok) {
        console.warn('Gemini API Error:', geminiData?.error?.message || geminiRes.statusText);
        throw new Error('Gemini API failed');
      }

      const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(clean);
    } catch (apiError) {
      console.warn('⚠️ Civilian Verification Fallback Active:', apiError.message);
      
      // Demo/Safety Fallback: If API fails, check purpose for emergency keywords
      const emergencyKeywords = ['emergency', 'hospital', 'patient', 'accident', 'injury', 'delivery', 'heart', 'breath', 'attack', 'critical', 'urgent'];
      const isEmergency = emergencyKeywords.some(k => purpose.toLowerCase().includes(k));
      
      result = {
        approved: isEmergency,
        confidence: 0.8,
        reason: isEmergency ? 'Local keyword-based emergency detection (Demo Fallback)' : 'Insufficient emergency indicators in request',
        riskLevel: isEmergency ? 'low' : 'medium',
        suggestedPriority: isEmergency ? 'high' : 'normal',
        verificationNotes: 'Automated fallback verification due to AI timeout'
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

    const GEMINI_KEY = process.env.GEMINI_API_KEY?.trim();
    const GROQ_KEY = process.env.GROQ_API_KEY?.trim();

    // ─── 0. Pre-defined FAQ Brain (Instant & Reliable) ─────────────────────
    const lowerMsg = message.toLowerCase();
    const faqs = [
      { 
        keywords: ['how to book', 'book ambulance', 'get ambulance'], 
        answer: "To book an ambulance: 1. Go to the Emergency section. 2. Select a nearby hospital. 3. Click 'Find Nearby Ambulances'. 4. Select your preferred ambulance and confirm. You can track it in real-time!" 
      },
      { 
        keywords: ['civilian mode', 'what is civilian'], 
        answer: "Civilian Mode allows you to use your personal vehicle as an emergency vehicle if no ambulance is available. Our AI verifies your emergency, and if approved, alerts police stations along your route for priority transit." 
      },
      { 
        keywords: ['how fast', 'arrival time', 'eta'], 
        answer: "Ambulance response times vary by location and traffic, but our average is under 5 minutes in urban areas. You'll see a live ETA on your tracking bar after booking." 
      },
      { 
        keywords: ['cost', 'price', 'free', 'charge'], 
        answer: "LifeLine+ is free for emergency coordination and routing. Ambulance operators and doctors may have their own service fees which you'll see during booking." 
      },
      { 
        keywords: ['contact', 'support', 'help', 'number'], 
        answer: "For immediate emergency help, call 108 or 112. For app support, email us at support@lifelineplus.in or visit our Contact page." 
      },
      { 
        keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening'], 
        answer: "Hello! I am LifeLine+ AI. How can I help you with your emergency or medical query today?" 
      },
      {
        keywords: ['what you know', 'what can you do', 'features', 'abilities'],
        answer: "I have access to your live location, nearby medical facilities (hospitals, doctors, pharmacies, police), and your active emergency route. I can help you find help, guide you through Civilian Mode, or provide first-aid advice."
      },
      {
        keywords: ['who are you', 'your name', 'about you'],
        answer: "I am the LifeLine+ AI assistant, designed by the LifeLine+ team to provide real-time support during medical emergencies in India."
      },
      {
        keywords: ['emergency', 'help me', 'sos', 'save me'],
        answer: "If this is a life-threatening emergency, please tap the red 'SOS' button immediately or dial 108. I am here to provide guidance while help is on the way."
      }
    ];

    const matchedFaq = faqs.find(f => f.keywords.some(k => lowerMsg.includes(k)));
    if (matchedFaq) {
      console.log('Backend: FAQ match success');
      return res.json({ text: matchedFaq.answer, model: 'local-faq-brain' });
    }

    const prompt = `You are LifeLine+ Chatbot, an advanced emergency response assistant for India.
Keep advice concise, practical, and safe. Encourage calling 108/112 for serious life-threatening emergencies.

Context Data:
- User Location: ${context?.location ? `${context.location.lat}, ${context.location.lng}` : 'Unknown'}
- Selected Facility: ${context?.selectedHospital ? JSON.stringify(context.selectedHospital) : 'None'}
- Active Route: ${context?.activeRoute ? JSON.stringify(context.activeRoute) : 'None'}
- Nearby Services (Hospitals/Police/Pharmacies): ${JSON.stringify(context?.nearbyServices || [])}

Instructions:
1. When the user asks for help or nearby options, refer to specific facilities from the 'Nearby Services' list by name.
2. Use **Markdown** formatting: Use **bold** for critical steps and instructions. **DO NOT use italics.**
3. Be professional, empathetic, and urgent.

User Query: ${message}`;

    // 1. Try Gemini
    try {
      if (!GEMINI_KEY) throw new Error('Gemini Key missing');
      const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const geminiData = await geminiRes.json();
      if (geminiRes.ok && geminiData?.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log('Backend: Gemini success');
        return res.json({ text: geminiData.candidates[0].content.parts[0].text, model: 'gemini-1.5-flash' });
      }
      console.error(`Backend: Gemini API error [${geminiRes.status}]:`, JSON.stringify(geminiData));
      throw new Error(geminiData?.error?.message || 'Gemini error');
    } catch (e) {
      console.warn(`Backend: Gemini failed (${e.message}), falling back to Groq...`);
      // 2. Fallback to Groq
      try {
        if (!GROQ_KEY) throw new Error('Groq Key missing');
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { 
                role: "system", 
                content: "You are LifeLine+ Chatbot, an advanced emergency assistant for India. Help with medical queries using the provided context. Be extremely concise and focus on safety." 
              },
              { role: "user", content: prompt }
            ],
            temperature: 0.5,
            max_tokens: 500
          })
        });
        
        const groqData = await groqRes.json();
        if (groqRes.ok && groqData?.choices?.[0]?.message?.content) {
          console.log('Backend: Groq fallback success');
          return res.json({ 
            text: groqData.choices[0].message.content, 
            model: 'llama-3.3-70b-versatile' 
          });
        }
        console.error(`Backend: Groq API error [${groqRes.status}]:`, JSON.stringify(groqData));
        throw new Error(groqData?.error?.message || 'Groq error');
      } catch (ge) {
        console.error('Backend: All AI providers failed');
        return res.status(500).json({ 
          text: "I am having difficulty connecting to my AI core. For immediate help: 1. Tap the SOS button. 2. Dial 108. 3. My local FAQ brain is still active for basic queries like 'How to book'.", 
          error: true 
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'AI chat failed', details: error.message });
  }
});

export default router;
