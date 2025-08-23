const { Venue, User, Artist, Organiser } = require('../models');
const { createOrUpdateUserProfileSettings, createFolderStructure } = require('../helpers');

// Johannesburg North Venues Data
const johannesburgVenues = [
    {
        name: "Sandton Convention Centre",
        location: "Sandton",
        capacity: 3000,
        contact_email: "info@sandtonconvention.co.za",
        phone_number: "+27 11 517 0000",
        website: "https://www.sandtonconvention.co.za",
        address: "161 Maude Street, Sandown, Sandton, 2196, Johannesburg",
        latitude: -26.1085,
        longitude: 28.0562,
        main_picture: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
        description: "Premier conference and exhibition center in the heart of Sandton, featuring state-of-the-art facilities and flexible event spaces."
    },
    {
        name: "Montecasino",
        location: "Fourways",
        capacity: 2000,
        contact_email: "events@montecasino.co.za",
        phone_number: "+27 11 510 7000",
        website: "https://www.montecasino.co.za",
        address: "Montecasino Boulevard, Fourways, 2055, Johannesburg",
        latitude: -26.0027,
        longitude: 28.0000,
        main_picture: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        description: "Tuscan-themed entertainment complex with multiple event venues, theaters, and conference facilities."
    },
    {
        name: "The Venue at Melrose Arch",
        location: "Melrose Arch",
        capacity: 800,
        contact_email: "events@melrosearch.co.za",
        phone_number: "+27 11 684 0000",
        website: "https://www.melrosearch.co.za",
        address: "Melrose Arch, Melrose, 2196, Johannesburg",
        latitude: -26.1189,
        longitude: 28.0478,
        main_picture: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
        description: "Sophisticated urban venue in the heart of Melrose Arch, perfect for corporate events and social gatherings."
    },
    {
        name: "Hyde Park Corner",
        location: "Hyde Park",
        capacity: 500,
        contact_email: "events@hydeparkcorner.co.za",
        phone_number: "+27 11 325 4340",
        website: "https://www.hydeparkcorner.co.za",
        address: "Jan Smuts Avenue, Hyde Park, 2196, Johannesburg",
        latitude: -26.1333,
        longitude: 28.0333,
        main_picture: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop",
        description: "Elegant shopping and entertainment complex with versatile event spaces and premium amenities."
    },
    {
        name: "Rosebank Mall Events Space",
        location: "Rosebank",
        capacity: 400,
        contact_email: "events@rosebankmall.co.za",
        phone_number: "+27 11 447 5000",
        website: "https://www.rosebankmall.co.za",
        address: "Cradock Avenue, Rosebank, 2196, Johannesburg",
        latitude: -26.1425,
        longitude: 28.0444,
        main_picture: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
        description: "Modern mall-based venue with flexible event spaces and excellent accessibility."
    }
];

async function createVenues() {
    try {
        console.log('Starting venue creation...');
        
        // Get the first user to use as owner
        const user = await User.findOne();
        if (!user) {
            console.error('No users found in database. Please create a user first.');
            return;
        }

        // Get or create an organiser for the user
        let organiser = await Organiser.findOne({ where: { userId: user.id } });
        if (!organiser) {
            organiser = await Organiser.create({
                name: 'Johannesburg Venues',
                userId: user.id,
                contact_email: 'venues@johannesburg.co.za',
                phone_number: '+27 11 123 4567'
            });
        }

        let createdCount = 0;
        let skippedCount = 0;

        for (const venueData of johannesburgVenues) {
            try {
                // Check if venue already exists
                const existingVenue = await Venue.findOne({
                    where: { name: venueData.name }
                });

                if (existingVenue) {
                    console.log(`Venue "${venueData.name}" already exists, skipping...`);
                    skippedCount++;
                    continue;
                }

                // Create the venue
                const venue = await Venue.create({
                    ...venueData,
                    userId: user.id,
                    owner_id: organiser.id,
                    owner_type: 'organiser'
                });

                console.log(`✅ Created venue: ${venue.name}`);
                createdCount++;

            } catch (error) {
                console.error(`❌ Error creating venue "${venueData.name}":`, error.message);
            }
        }

        console.log('\n🎉 Venue creation completed!');
        console.log(`✅ Created: ${createdCount} venues`);
        console.log(`⏭️  Skipped: ${skippedCount} venues (already existed)`);
        console.log(`📊 Total processed: ${johannesburgVenues.length} venues`);

    } catch (error) {
        console.error('❌ Error in venue creation process:', error);
    }
}

// Run the script
if (require.main === module) {
    createVenues()
        .then(() => {
            console.log('Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Script failed:', error);
            process.exit(1);
        });
}

module.exports = { createVenues, johannesburgVenues };
