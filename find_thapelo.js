// Script to find artist Thapelo in the database
const axios = require('axios');

// API base URL - adjust this to your Render backend URL
const API_BASE_URL = 'https://my-gig-guide-backend.onrender.com'; // Update this to your actual Render URL

async function findThapelo() {
  try {
    console.log('🔍 Searching for artist Thapelo...');
    
    // Fetch all artists
    const response = await axios.get(`${API_BASE_URL}/api/artists`);
    
    if (response.data && response.data.length > 0) {
      console.log(`✅ Found ${response.data.length} artists in the database`);
      
      // Search for Thapelo
      const thapelo = response.data.find(artist => 
        artist.stage_name?.toLowerCase().includes('thapelo') ||
        artist.real_name?.toLowerCase().includes('thapelo') ||
        artist.username?.toLowerCase().includes('thapelo')
      );
      
      if (thapelo) {
        console.log('\n🎯 Found Thapelo!');
        console.log('Artist Details:');
        console.log('ID:', thapelo.id);
        console.log('User ID:', thapelo.userId);
        console.log('Stage Name:', thapelo.stage_name);
        console.log('Real Name:', thapelo.real_name);
        console.log('Genre:', thapelo.genre);
        console.log('Bio:', thapelo.bio);
        console.log('Phone:', thapelo.phone_number);
        console.log('Instagram:', thapelo.instagram);
        console.log('Facebook:', thapelo.facebook);
        console.log('Twitter:', thapelo.twitter);
        console.log('Profile Picture:', thapelo.profile_picture);
        console.log('Settings:', thapelo.settings);
        console.log('Gallery:', thapelo.gallery);
      } else {
        console.log('\n❌ Thapelo not found in the database');
        console.log('\n📋 All artists in database:');
        response.data.forEach((artist, index) => {
          console.log(`${index + 1}. ${artist.stage_name} (${artist.real_name || 'No real name'}) - ID: ${artist.id}`);
        });
      }
    } else {
      console.log('❌ No artists found in the database');
    }
    
  } catch (error) {
    console.error('❌ Error searching for Thapelo:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the search
findThapelo();
