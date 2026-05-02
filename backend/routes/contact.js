import express from 'express';
import { randomUUID } from 'crypto';
import { saveDocument, getFirestore } from '../lib/firebaseAdmin.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};
    const name = String(payload.name || '').trim();
    const email = String(payload.email || '').trim();
    const message = String(payload.message || '').trim();
    const accountName = String(payload.accountName || '').trim();

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }

    const now = new Date().toISOString();
    const contactMessage = {
      id: payload.id || randomUUID(),
      name,
      email,
      message,
      ...(accountName ? { accountName } : {}),
      status: 'new',
      source: 'contact-form',
      timestamp: now,
      createdAt: now,
      updatedAt: now
    };

    const saved = await saveDocument('usercontact', contactMessage.id, contactMessage);
    const firestoreAvailable = Boolean(getFirestore());
    
    if (!saved) {
      console.error('❌ [Contact] saveDocument returned false for', contactMessage.id);
      return res.status(500).json({ success: false, error: 'Failed to persist contact message', firestoreAvailable });
    }

    res.status(201).json({ success: true, message: 'Contact message saved', data: contactMessage, firestoreAvailable });
  } catch (error) {
    console.error('❌ [Contact] Failed to save message:', error);
    res.status(500).json({ success: false, error: 'Failed to save contact message', details: error.message });
  }
});

export default router;