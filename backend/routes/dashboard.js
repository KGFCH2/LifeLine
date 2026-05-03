import express from 'express';
import { saveDocument, getDocument } from '../lib/firebaseAdmin.js';

const router = express.Router();

// In-memory stats storage (in production, use Redis or database)
const userStats = new Map();
const userActivity = new Map();

// Initialize default stats for a user
function getOrCreateUserStats(userId) {
  if (!userStats.has(userId)) {
    userStats.set(userId, {
      totalRequests: 0,
      activeAmbulances: 0,
      avgResponseTime: '0m 00s',
      policeAlerts: 0,
      level: 'Silver',
      lastUpdated: new Date().toISOString()
    });
  }
  return userStats.get(userId);
}

// Initialize default activity for a user
function getOrCreateUserActivity(userId) {
  if (!userActivity.has(userId)) {
    userActivity.set(userId, []);
  }
  return userActivity.get(userId);
}

// GET /api/dashboard/stats - Get user dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Try to get from Firestore first
    const storedStats = await getDocument('userStats', userId);
    
    if (storedStats) {
      return res.json(storedStats);
    }

    // Return in-memory stats (will be initialized if not exists)
    const stats = getOrCreateUserStats(userId);
    
    // Save to Firestore for persistence
    await saveDocument('userStats', userId, stats);
    
    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    // Return fallback data
    res.json({
      totalRequests: 12,
      activeAmbulances: 8,
      avgResponseTime: '4m 30s',
      policeAlerts: 3,
      source: 'fallback'
    });
  }
});

// GET /api/dashboard/activity - Get user recent activity
router.get('/activity', async (req, res) => {
  try {
    const { userId, limit = 10 } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get activities (from memory or initialize)
    const activities = getOrCreateUserActivity(userId);
    
    // Sort by timestamp (newest first) and limit
    const sortedActivities = activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, parseInt(limit));

    res.json({
      count: sortedActivities.length,
      activities: sortedActivities,
      userId
    });
  } catch (error) {
    console.error('Dashboard activity error:', error);
    // Return fallback data
    res.json({
      count: 4,
      activities: [
        { id: 1, type: 'ambulance', title: 'Ambulance AMB-1002 assigned', time: '2 min ago', status: 'active' },
        { id: 2, type: 'civilian', title: 'Civilian mode activated', time: '15 min ago', status: 'completed' },
        { id: 3, type: 'police', title: 'Police alert sent to City PS', time: '1 hour ago', status: 'completed' },
        { id: 4, type: 'booking', title: 'Dr. Sharma appointment confirmed', time: '3 hours ago', status: 'confirmed' },
      ],
      source: 'fallback'
    });
  }
});

// POST /api/dashboard/activity - Add new activity
router.post('/activity', async (req, res) => {
  try {
    const { userId, type, title, status } = req.body;
    if (!userId || !type || !title) {
      return res.status(400).json({ error: 'userId, type, and title are required' });
    }

    const activities = getOrCreateUserActivity(userId);
    
    const newActivity = {
      id: Date.now(),
      type,
      title,
      status: status || 'active',
      time: 'just now',
      timestamp: Date.now()
    };

    activities.unshift(newActivity);
    
    // Keep only last 50 activities
    if (activities.length > 50) {
      activities.pop();
    }

    // UPDATE STATS AUTOMATICALLY
    const currentStats = getOrCreateUserStats(userId);
    if (type === 'ambulance' || type === 'civilian') {
      currentStats.totalRequests += 1;
      
      // Update Level logic
      if (currentStats.totalRequests >= 20) currentStats.level = 'Platinum';
      else if (currentStats.totalRequests >= 10) currentStats.level = 'Gold';
      else currentStats.level = 'Silver';

      currentStats.lastUpdated = new Date().toISOString();
      userStats.set(userId, currentStats);
      await saveDocument('userStats', userId, currentStats);
    }

    // Update time strings for relative times
    activities.forEach((activity, index) => {
      const diff = Date.now() - activity.timestamp;
      if (diff < 60000) activity.time = 'just now';
      else if (diff < 3600000) activity.time = `${Math.floor(diff / 60000)} min ago`;
      else if (diff < 86400000) activity.time = `${Math.floor(diff / 3600000)} hours ago`;
      else activity.time = `${Math.floor(diff / 86400000)} days ago`;
    });

    res.json({ success: true, activity: newActivity, stats: currentStats });
  } catch (error) {
    console.error('Add activity error:', error);
    res.status(500).json({ error: 'Failed to add activity' });
  }
});

// POST /api/dashboard/stats/update - Update user stats
router.post('/stats/update', async (req, res) => {
  try {
    const { userId, stats } = req.body;
    if (!userId || !stats) {
      return res.status(400).json({ error: 'userId and stats are required' });
    }

    const currentStats = getOrCreateUserStats(userId);
    const updatedStats = { ...currentStats, ...stats, lastUpdated: new Date().toISOString() };
    
    userStats.set(userId, updatedStats);
    await saveDocument('userStats', userId, updatedStats);

    res.json({ success: true, stats: updatedStats });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ error: 'Failed to update stats' });
  }
});

export default router;
