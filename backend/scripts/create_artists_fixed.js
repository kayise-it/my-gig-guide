const db = require('../models');
const bcrypt = require('bcryptjs');
const { southAfricanUsers } = require('./south_african_users');

async function createArtists() {
    try {
        console.log('🎵 Creating 4 South African artists...\n');
        
        const createdUsers = [];
        const createdArtists = [];

        for (const artistData of southAfricanUsers.artists) {
            try {
                // Create user
                const hashedPassword = await bcrypt.hash(artistData.password, 10);
                const user = await db.user.create({
                    username: artistData.username,
                    email: artistData.email,
                    password: hashedPassword,
                    role: 1 // Artist role
                });

                // Create artist with stage_name
                const artist = await db.artist.create({
                    name: artistData.name,
                    stage_name: artistData.name, // Use name as stage_name
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
                console.log(`✅ Created artist: ${artistData.name} (${artistData.username}) - ${artistData.genre}`);

            } catch (error) {
                console.error(`❌ Error creating artist "${artistData.name}":`, error.message);
            }
        }

        console.log('\n🎉 Artist creation completed!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Created users: ${createdUsers.length}`);
        console.log(`🎵 Created artists: ${createdArtists.length}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        console.log('\n🎵 Artists Created:');
        createdArtists.forEach(artist => {
            console.log(`   • ${artist.name} (${artist.genre})`);
        });

    } catch (error) {
        console.error('❌ Fatal error in artist creation process:', error);
    }
}

// Run the script
if (require.main === module) {
    createArtists()
        .then(() => {
            console.log('\n✨ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Script failed:', error);
            process.exit(1);
        });
}

module.exports = { createArtists };
