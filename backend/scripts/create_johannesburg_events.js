const db = require('../models');

// Sample events with Johannesburg venues
const johannesburgEvents = [
    {
        name: "Jazz Night at Sandton Convention",
        description: "An evening of smooth jazz featuring local and international artists in the heart of Sandton.",
        date: "2025-09-15",
        time: "19:00",
        price: 350,
        category: "Jazz",
        capacity: 500,
        venue_id: null, // Will be set dynamically
        owner_type: "organiser",
        owner_id: null // Will be set dynamically
    },
    {
        name: "Electronic Beats at Montecasino",
        description: "A night of electronic music and dance in the iconic Montecasino venue.",
        date: "2025-09-20",
        time: "22:00",
        price: 200,
        category: "Electronic",
        capacity: 800,
        venue_id: null,
        owner_type: "organiser",
        owner_id: null
    },
    {
        name: "Classical Concert at The Forum",
        description: "A beautiful evening of classical music in the prestigious Forum venue.",
        date: "2025-09-25",
        time: "20:00",
        price: 450,
        category: "Classical",
        capacity: 300,
        venue_id: null,
        owner_type: "organiser",
        owner_id: null
    },
    {
        name: "Afro-Pop Festival at Rosebank Mall",
        description: "Celebrating African music with top local artists in Rosebank.",
        date: "2025-09-30",
        time: "18:00",
        price: 150,
        category: "Afro-Pop",
        capacity: 400,
        venue_id: null,
        owner_type: "organiser",
        owner_id: null
    },
    {
        name: "Luxury Dinner & Jazz at Westcliff Hotel",
        description: "An exclusive evening of fine dining and jazz music in the luxurious Westcliff Hotel.",
        date: "2025-10-05",
        time: "19:30",
        price: 800,
        category: "Jazz",
        capacity: 200,
        venue_id: null,
        owner_type: "organiser",
        owner_id: null
    }
];

async function createJohannesburgEvents() {
    try {
        console.log('🎵 Creating Johannesburg events...\n');
        
        // Get a user to use as creator
        const user = await db.user.findOne();
        if (!user) {
            console.error('❌ No users found in database.');
            return;
        }

        // Get venues and organisers
        const venues = await db.venue.findAll({
            where: {
                name: {
                    [db.Sequelize.Op.in]: [
                        'Sandton Convention Centre',
                        'Montecasino',
                        'The Forum',
                        'Rosebank Mall Events Space',
                        'The Westcliff Hotel'
                    ]
                }
            }
        });

        const organisers = await db.organiser.findAll({
            limit: 5
        });

        console.log(`Found ${venues.length} venues and ${organisers.length} organisers`);

        let createdCount = 0;
        let skippedCount = 0;

        for (let i = 0; i < johannesburgEvents.length; i++) {
            const eventData = johannesburgEvents[i];
            
            try {
                // Check if event already exists
                const existingEvent = await db.event.findOne({
                    where: { name: eventData.name }
                });

                if (existingEvent) {
                    console.log(`⏭️  Skipping: ${eventData.name} (already exists)`);
                    skippedCount++;
                    continue;
                }

                // Assign venue and organiser
                const venue = venues[i % venues.length];
                const organiser = organisers[i % organisers.length];

                if (!venue || !organiser) {
                    console.log(`⚠️  Skipping: ${eventData.name} (no venue or organiser available)`);
                    continue;
                }

                // Create the event
                const event = await db.event.create({
                    ...eventData,
                    userId: user.id,
                    venue_id: venue.id,
                    owner_id: organiser.id
                });

                console.log(`✅ Created: ${event.name} at ${venue.name}`);
                createdCount++;

            } catch (error) {
                console.error(`❌ Error creating "${eventData.name}":`, error.message);
            }
        }

        console.log('\n🎉 Event creation completed!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Created: ${createdCount} events`);
        console.log(`⏭️  Skipped: ${skippedCount} events`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    } catch (error) {
        console.error('❌ Fatal error in event creation process:', error);
    }
}

// Run the script
if (require.main === module) {
    createJohannesburgEvents()
        .then(() => {
            console.log('\n✨ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Script failed:', error);
            process.exit(1);
        });
}

module.exports = { createJohannesburgEvents };
