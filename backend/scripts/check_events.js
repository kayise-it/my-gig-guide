const db = require('../models');

async function checkEvents() {
    try {
        console.log('🔍 Checking events in database...\n');
        
        const events = await db.event.findAll({
            include: [{
                model: db.venue,
                attributes: ["id", "name", "address", "latitude", "longitude"],
                as: 'venue'
            }]
        });

        console.log(`📊 Total events found: ${events.length}\n`);

        if (events.length > 0) {
            console.log('📋 Events with venue data:');
            events.forEach((event, index) => {
                console.log(`\n${index + 1}. ${event.name}`);
                console.log(`   Date: ${event.date}`);
                console.log(`   Venue: ${event.venue ? event.venue.name : 'No venue'}`);
                if (event.venue) {
                    console.log(`   Address: ${event.venue.address}`);
                    console.log(`   Coordinates: ${event.venue.latitude}, ${event.venue.longitude}`);
                }
            });
        } else {
            console.log('❌ No events found in database');
        }

    } catch (error) {
        console.error('❌ Error checking events:', error);
    }
}

checkEvents()
    .then(() => {
        console.log('\n✨ Check completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Check failed:', error);
        process.exit(1);
    });
