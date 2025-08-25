const db = require('../models');
const bcrypt = require('bcryptjs');
const { southAfricanUsers } = require('./south_african_users');
const { johannesburgVenues } = require('./venue_data');

async function createUsersAndLinkVenues() {
    try {
        console.log('🚀 Starting South African users creation and venue linking...\n');
        
        const createdUsers = [];
        const createdOrganisers = [];
        const createdArtists = [];

        // Create Organisers
        console.log('👥 Creating 7 organisers...');
        for (const organiserData of southAfricanUsers.organisers) {
            try {
                // Create user
                const hashedPassword = await bcrypt.hash(organiserData.password, 10);
                const user = await db.user.create({
                    username: organiserData.username,
                    email: organiserData.email,
                    password: hashedPassword,
                    role: 4 // Organiser role
                });

                // Create organiser
                const organiser = await db.organiser.create({
                    name: organiserData.name,
                    userId: user.id,
                    contact_email: organiserData.contact_email,
                    phone_number: organiserData.phone_number,
                    website: organiserData.website,
                    description: organiserData.description
                });

                createdUsers.push(user);
                createdOrganisers.push(organiser);
                console.log(`✅ Created organiser: ${organiserData.name} (${organiserData.username})`);

            } catch (error) {
                console.error(`❌ Error creating organiser "${organiserData.name}":`, error.message);
                console.error('Full error:', error);
            }
        }

        // Create Artists
        console.log('\n🎵 Creating 4 artists...');
        for (const artistData of southAfricanUsers.artists) {
            try {
                // Create user
                const hashedPassword = await bcrypt.hash(artistData.password, 10);
                const user = await db.user.create({
                    username: artistData.username,
                    email: artistData.email,
                    password: hashedPassword,
                    role: 3 // Artist role
                });

                // Create artist
                const artist = await db.artist.create({
                    name: artistData.name,
                    userId: user.id,
                    bio: artistData.bio,
                    genre: artistData.genre,
                    contact_email: artistData.contact_email,
                    phone_number: artistData.phone_number,
                    website: artistData.website,
                    social_media: JSON.stringify(artistData.social_media)
                });

                createdUsers.push(user);
                createdArtists.push(artist);
                console.log(`✅ Created artist: ${artistData.name} (${artistData.username})`);

            } catch (error) {
                console.error(`❌ Error creating artist "${artistData.name}":`, error.message);
                console.error('Full error:', error);
            }
        }

        // Link venues to organisers
        console.log('\n🏢 Linking venues to organisers...');
        
        // Define venue assignments to organisers
        const venueAssignments = [
            // JohannesburgEvents - Large venues
            { organiserIndex: 0, venueNames: ["Sandton Convention Centre", "Emperors Palace"] },
            // SandtonVenues - Sandton venues
            { organiserIndex: 1, venueNames: ["The Radisson Blu Hotel Sandton", "The Michelangelo Hotel", "The Maslow Hotel", "The Sandton Sun Hotel"] },
            // FourwaysEntertainment - Fourways venues
            { organiserIndex: 2, venueNames: ["Montecasino", "The Indaba Hotel", "The Palazzo Hotel"] },
            // RosebankEvents - Rosebank venues
            { organiserIndex: 3, venueNames: ["Rosebank Mall Events Space", "The Rosebank Hotel"] },
            // WestcliffLuxury - Westcliff venues
            { organiserIndex: 4, venueNames: ["The Westcliff Hotel", "The Four Seasons Hotel"] },
            // BryanstonVenues - Bryanston venues
            { organiserIndex: 5, venueNames: ["The Forum", "The Bryanston Country Club"] },
            // MelroseArchEvents - Melrose and other venues
            { organiserIndex: 6, venueNames: ["The Venue at Melrose Arch", "Hyde Park Corner", "The Wanderers Club", "The Saxon Hotel", "The Dainfern Golf Estate"] }
        ];

        let linkedVenues = 0;
        let skippedVenues = 0;

        for (const assignment of venueAssignments) {
            const organiser = createdOrganisers[assignment.organiserIndex];
            if (!organiser) continue;

            for (const venueName of assignment.venueNames) {
                try {
                    // Find the venue
                    const venue = await db.venue.findOne({
                        where: { name: venueName }
                    });

                    if (venue) {
                        // Update venue to link to this organiser
                        await venue.update({
                            userId: organiser.userId,
                            owner_id: organiser.id,
                            owner_type: 'organiser'
                        });

                        console.log(`🔗 Linked: ${venueName} → ${organiser.name}`);
                        linkedVenues++;
                    } else {
                        console.log(`⚠️  Venue not found: ${venueName}`);
                        skippedVenues++;
                    }

                } catch (error) {
                    console.error(`❌ Error linking venue "${venueName}":`, error.message);
                }
            }
        }

        // Summary
        console.log('\n🎉 User creation and venue linking completed!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Created users: ${createdUsers.length}`);
        console.log(`👥 Created organisers: ${createdOrganisers.length}`);
        console.log(`🎵 Created artists: ${createdArtists.length}`);
        console.log(`🔗 Linked venues: ${linkedVenues}`);
        console.log(`⏭️  Skipped venues: ${skippedVenues}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Show organiser-venue assignments
        console.log('\n📋 Venue Assignments by Organiser:');
        for (const assignment of venueAssignments) {
            const organiser = createdOrganisers[assignment.organiserIndex];
            if (organiser) {
                console.log(`\n�� ${organiser.name}:`);
                assignment.venueNames.forEach(venueName => {
                    console.log(`   • ${venueName}`);
                });
            }
        }

        console.log('\n🎵 Artists Created:');
        createdArtists.forEach(artist => {
            console.log(`   • ${artist.name} (${artist.genre})`);
        });

    } catch (error) {
        console.error('❌ Fatal error in user creation process:', error);
    }
}

// Run the script
if (require.main === module) {
    createUsersAndLinkVenues()
        .then(() => {
            console.log('\n✨ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Script failed:', error);
            process.exit(1);
        });
}

module.exports = { createUsersAndLinkVenues };
