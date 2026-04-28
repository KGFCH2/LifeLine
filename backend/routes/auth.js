import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { getFirebaseAdmin, saveDocument, getDocument, getUserByEmail, incrementSigninCount } from '../lib/firebaseAdmin.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify Google Token and Sign In/Up
router.post('/google', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    console.error('❌ [Google Auth] No ID token provided');
    return res.status(400).json({ error: 'No ID token provided' });
  }

  try {
    console.log('🔐 [Google Auth] Verifying token...');
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    console.log(`👤 [Google Auth] Token verified for: ${email}`);

    // Check if user exists in Firestore
    let user = await getDocument('users', googleId);
    let userData = {
      id: googleId,
      email,
      name,
      photoURL: picture,
      updatedAt: new Date().toISOString()
    };

    if (!user) {
      console.log('🆕 [Google Auth] Creating new user...');
      userData.createdAt = new Date().toISOString();
      userData.provider = 'google';
      userData.signinCount = 1;
      await saveDocument('users', googleId, userData);
    } else {
      console.log('✅ [Google Auth] Existing user found, updating profile...');
      await incrementSigninCount(googleId);
      await saveDocument('users', googleId, {
        name,
        photoURL: picture,
        updatedAt: new Date().toISOString()
      });
      user = await getDocument('users', googleId);
      userData = { ...user, ...userData };
    }

    res.json({ 
      success: true, 
      user: userData 
    });
  } catch (error) {
    console.error('❌ [Google Auth] Error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// Legacy Sign Up (Email/Password)
router.post('/signup', async (req, res) => {
  try {
    const { id, name, email, phone, photo, provider, createdAt } = req.body;

    if (!id || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userData = {
      id,
      name: name || 'User',
      email,
      phone: phone || '',
      photo: photo || '',
      provider: provider || 'email',
      createdAt: createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };

    await saveDocument('users', id, userData);
    res.status(200).json({ success: true, user: userData });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ error: 'Failed to save user data' });
  }
});

// Get user data
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await getDocument('users', userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user data' });
  }
});

export default router;
