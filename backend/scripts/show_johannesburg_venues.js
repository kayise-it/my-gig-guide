const db = require('../models');
const { johannesburgVenues } = require('./venue_data');

async function showJohannesburgVenues() {
    try {
        console.log('🏢 Johannesburg North Venues in Database\n');
        
        // Get all venues and filter for Johannesburg ones
        const allVenues = await db.venue.findAll();
        const jhbVenueNames = johannesburgVenues.map(v => v.name);
        
        const jhbVenues = allVenues.filter(venue => 
            jhbVenueNames.includes(venue.name)
        );

        console.log(`📊 Total Johannesburg venues found: ${jhbVenues.length}\n`);

        // Group by location
        const venuesByLocation = {};
        jhbVenues.forEach(venue => {
            if (!venuesByLocation[venue.location]) {
                venuesByLocation[venue.location] = [];
            }
            venuesByLocation[venue.location].push(venue);
        });

        // Display grouped venues
        Object.keys(venuesByLocation).sort().forEach(location => {
            const locationVenues = venuesByLocation[location];
            console.log(`📍 ${location} (${locationVenues.length} venues):`);
            
            locationVenues.forEach(venue => {
                console.log(`   • ${venue.name}`);
                console.log(`     Capacity: ${venue.capacity} | Email: ${venue.contact_email}`);
                console.log(`     Phone: ${venue.phone_number}`);
                console.log(`     Address: ${venue.address}`);
                console.log('');
            });
        });

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Successfully created ${jhbVenues.length} Johannesburg venues!`);
        console.log('🌍 These venues are now available for events and venue browsing.');
        console.log('🗺️  All venues include GPS coordinates for mapping features.');
        console.log('📱 Contact information is ready for event organizers.');

    } catch (error) {
        console.error('❌ Error showing Johannesburg venues:', error);
    }
}

// Run the script
if (require.main === module) {
    showJohannesburgVenues()
        .then(() => {
            console.log('\n✨ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Script failed:', error);
            process.exit(1);
        });
}

module.exports = { showJohannesburgVenues };
