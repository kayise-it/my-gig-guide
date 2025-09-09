// Test endpoint to verify guard logic
const express = require('express');
const app = express();
const db = require('./models');

app.use(express.json());

app.post('/test-guard', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('Testing guard for userId:', userId);
    
    const artist = await db.artist.findOne({ where: { userId } });
    console.log('Artist found:', !!artist);
    console.log('Artist settings:', artist?.settings);
    
    if (!artist || !artist.settings || artist.settings.trim() === '') {
      console.log('🚫 GUARD TRIGGERED: Artist settings missing');
      return res.status(409).json({ error: 'Artist settings missing for user. Initialize profile settings before uploading.' });
    }
    
    console.log('✅ GUARD PASSED: Artist has settings');
    res.json({ message: 'Guard passed', settings: artist.settings });
    
  } catch (error) {
    console.error('Guard test error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Test server running on port 3001');
});


