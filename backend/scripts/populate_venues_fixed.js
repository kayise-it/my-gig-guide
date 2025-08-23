const db = require('../models');
const { johannesburgVenues } = require('./venue_data');

async function populateVenues() {
    try {
        console.log('🚀 Starting venue population...');
        
        // Get the first user to use as owner
        const user = await db.user.findOne();
        if (!user) {
            console.error('❌ No users found in database. Please create a user first.');
            return;
        }

        console.log(`✅ Found user: ${user.username}`);

        // Get or create an organiser for the user
        let organiser = await db.organiser.findOne({ where: { userId: user.id } });
        if (!organiser) {
            organiser = await db.organiser.create({
                name: 'Johannesburg Venues',
                userId: user.id,
                contact_email: 'venues@johannesburg.co.za',
                phone_number: '+27 11 123 4567'
            });
            console.log(`✅ Created organiser: ${organiser.name}`);
        } else {
            console.log(`✅ Using existing organiser: ${organiser.name}`);
        }

        let createdCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        console.log(`\n📋 Processing ${johannesburgVenues.length} venues...\n`);

        for (const venueData of johannesburgVenues) {
            try {
                // Check if venue already exists
                const existingVenue = await db.venue.findOne({
                    where: { name: venueData.name }
                });

                if (existingVenue) {
                    console.log(`⏭️  Skipping: ${venueData.name} (already exists)`);
                    skippedCount++;
                    continue;
                }

                // Create the venue
                const venue = await db.venue.create({
                    ...venueData,
                    userId: user.id,
                    owner_id: organiser.id,
                    owner_type: 'organiser'
                });

                console.log(`✅ Created: ${venue.name} (${venue.location})`);
                createdCount++;

            } catch (error) {
                console.error(`❌ Error creating "${venueData.name}":`, error.message);
                errorCount++;
            }
        }

        console.log('\n🎉 Venue population completed!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Successfully created: ${createdCount} venues`);
        console.log(`⏭️  Skipped (already existed): ${skippedCount} venues`);
        console.log(`❌ Errors: ${errorCount} venues`);
        console.log(`📊 Total processed: ${johannesburgVenues.length} venues`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        if (createdCount > 0) {
            console.log('\n📍 Venues created in these areas:');
            const locations = [...new Set(johannesburgVenues.map(v => v.location))];
            locations.forEach(location => {
                const count = johannesburgVenues.filter(v => v.location === location).length;
                console.log(`   • ${location}: ${count} venues`);
            });
        }

    } catch (error) {
        console.error('❌ Fatal error in venue population process:', error);
    }
}

// Run the script
if (require.main === module) {
    populateVenues()
        .then(() => {
            console.log('\n✨ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Script failed:', error);
            process.exit(1);
        });
}

module.exports = { populateVenues };
