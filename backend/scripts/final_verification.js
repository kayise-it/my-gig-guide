const db = require('../models');

async function finalVerification() {
    try {
        console.log('🔍 Final Verification - Database Status\n');
        
        // Count all entities
        const userCount = await db.user.count();
        const organiserCount = await db.organiser.count();
        const artistCount = await db.artist.count();
        const venueCount = await db.venue.count();
        
        console.log('📊 Database Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`👥 Total Users: ${userCount}`);
        console.log(`🏢 Total Organisers: ${organiserCount}`);
        console.log(`🎵 Total Artists: ${artistCount}`);
        console.log(`🏟️  Total Venues: ${venueCount}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Show organisers and their venues
        console.log('\n🏢 Organisers and Their Venues:');
        const organisers = await db.organiser.findAll({
            include: [{
                model: db.venue,
                as: 'venues',
                where: { owner_type: 'organiser' },
                required: false
            }]
        });

        organisers.forEach(organiser => {
            console.log(`\n📋 ${organiser.name}:`);
            if (organiser.venues && organiser.venues.length > 0) {
                organiser.venues.forEach(venue => {
                    console.log(`   • ${venue.name} (${venue.location})`);
                });
            } else {
                console.log(`   • No venues linked`);
            }
        });

        // Show artists
        console.log('\n🎵 Artists:');
        const artists = await db.artist.findAll();
        artists.forEach(artist => {
            console.log(`   • ${artist.stage_name} (${artist.genre})`);
        });

        // Show venue distribution
        console.log('\n🏟️  Venue Distribution by Location:');
        const venues = await db.venue.findAll();
        const venueByLocation = {};
        venues.forEach(venue => {
            if (!venueByLocation[venue.location]) {
                venueByLocation[venue.location] = [];
            }
            venueByLocation[venue.location].push(venue);
        });

        Object.keys(venueByLocation).sort().forEach(location => {
            const locationVenues = venueByLocation[location];
            console.log(`\n�� ${location} (${locationVenues.length} venues):`);
            locationVenues.forEach(venue => {
                console.log(`   • ${venue.name} - Owner: ${venue.owner_type}`);
            });
        });

        console.log('\n✅ Verification completed successfully!');

    } catch (error) {
        console.error('❌ Error during verification:', error);
    }
}

finalVerification()
    .then(() => {
        console.log('\n✨ Final verification completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Final verification failed:', error);
        process.exit(1);
    });
