const db = require('../models');
const bcrypt = require('bcryptjs');

// Simple artist data with only required fields
const artists = [
    {
        username: "LeratoMaseko",
        email: "lerato@leratomaseko.co.za",
        password: "password123",
        stage_name: "Lerato Maseko",
        real_name: "Lerato Maseko",
        genre: "Jazz",
        bio: "Award-winning jazz vocalist and songwriter from Johannesburg, known for her soulful voice and contemporary jazz fusion.",
        phone_number: "+27 82 123 4567",
        instagram: "@lerato_maseko",
        facebook: "LeratoMasekoMusic",
        twitter: "@lerato_maseko"
    },
    {
        username: "ThaboNkosi",
        email: "thabo@thabonkosi.co.za",
        password: "password123",
        stage_name: "Thabo Nkosi",
        real_name: "Thabo Nkosi",
        genre: "Afro-Pop",
        bio: "Dynamic Afro-pop artist and guitarist, blending traditional African rhythms with modern pop sensibilities.",
        phone_number: "+27 82 234 5678",
        instagram: "@thabo_nkosi",
        facebook: "ThaboNkosiMusic",
        twitter: "@thabo_nkosi"
    },
    {
        username: "ZaneleDlamini",
        email: "zanele@zanele.co.za",
        password: "password123",
        stage_name: "Zanele Dlamini",
        real_name: "Zanele Dlamini",
        genre: "Classical",
        bio: "Classical pianist and composer, performing both traditional classical pieces and contemporary compositions.",
        phone_number: "+27 82 345 6789",
        instagram: "@zanele_piano",
        facebook: "ZaneleDlaminiPiano",
        twitter: "@zanele_piano"
    },
    {
        username: "SiphoMthembu",
        email: "sipho@siphomthembu.co.za",
        password: "password123",
        stage_name: "Sipho Mthembu",
        real_name: "Sipho Mthembu",
        genre: "Electronic/House",
        bio: "Versatile DJ and electronic music producer, creating unique blends of house, kwaito, and international electronic music.",
        phone_number: "+27 82 456 7890",
        instagram: "@sipho_dj",
        facebook: "SiphoMthembuDJ",
        twitter: "@sipho_dj"
    }
];

async function createArtists() {
    try {
        console.log('�� Creating 4 South African artists...\n');
        
        const createdUsers = [];
        const createdArtists = [];

        for (const artistData of artists) {
            try {
                // Create user
                const hashedPassword = await bcrypt.hash(artistData.password, 10);
                const user = await db.user.create({
                    username: artistData.username,
                    email: artistData.email,
                    password: hashedPassword,
                    role: 1 // Artist role
                });

                // Create artist with only the fields that exist in the model
                const artist = await db.artist.create({
                    userId: user.id,
                    stage_name: artistData.stage_name,
                    real_name: artistData.real_name,
                    genre: artistData.genre,
                    bio: artistData.bio,
                    phone_number: artistData.phone_number,
                    instagram: artistData.instagram,
                    facebook: artistData.facebook,
                    twitter: artistData.twitter
                });

                createdUsers.push(user);
                createdArtists.push(artist);
                console.log(`✅ Created artist: ${artistData.stage_name} (${artistData.username}) - ${artistData.genre}`);

            } catch (error) {
                console.error(`❌ Error creating artist "${artistData.stage_name}":`, error.message);
            }
        }

        console.log('\n🎉 Artist creation completed!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Created users: ${createdUsers.length}`);
        console.log(`🎵 Created artists: ${createdArtists.length}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        console.log('\n🎵 Artists Created:');
        createdArtists.forEach(artist => {
            console.log(`   • ${artist.stage_name} (${artist.genre})`);
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
