const db = require('../models');

async function verifyVenues() {
    try {
        console.log('🔍 Verifying venues in database...\n');
        
        const venues = await db.venue.findAll({
            order: [['location', 'ASC'], ['name', 'ASC']]
        });

        console.log(`📊 Total venues found: ${venues.length}\n`);

        // Group by location
        const venuesByLocation = {};
        venues.forEach(venue => {
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
                console.log(`   • ${venue.name} - Capacity: ${venue.capacity}`);
            });
            console.log('');
        });

        // Show some sample venue details
        if (venues.length > 0) {
            const sampleVenue = venues[0];
            console.log('📋 Sample Venue Details:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`Name: ${sampleVenue.name}`);
            console.log(`Location: ${sampleVenue.location}`);
            console.log(`Capacity: ${sampleVenue.capacity} people`);
            console.log(`Address: ${sampleVenue.address}`);
            console.log(`Email: ${sampleVenue.contact_email}`);
            console.log(`Phone: ${sampleVenue.phone_number}`);
            console.log(`Website: ${sampleVenue.website}`);
            console.log(`Coordinates: ${sampleVenue.latitude}, ${sampleVenue.longitude}`);
            console.log(`Image: ${sampleVenue.main_picture}`);
            console.log(`Description: ${sampleVenue.description}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }

    } catch (error) {
        console.error('❌ Error verifying venues:', error);
    }
}

// Run the script
if (require.main === module) {
    verifyVenues()
        .then(() => {
            console.log('\n✅ Verification completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Verification failed:', error);
            process.exit(1);
        });
}

module.exports = { verifyVenues };
