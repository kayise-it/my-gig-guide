const db = require('../models');

async function debugArtist() {
    try {
        console.log('🔍 Debugging artist creation...\n');
        
        // Check existing artists
        const existingArtists = await db.artist.findAll();
        console.log(`Existing artists: ${existingArtists.length}`);
        
        if (existingArtists.length > 0) {
            console.log('Sample artist structure:');
            console.log(JSON.stringify(existingArtists[0].toJSON(), null, 2));
        }

        // Check user table structure
        const existingUsers = await db.user.findAll({ where: { role: 1 } });
        console.log(`\nUsers with artist role: ${existingUsers.length}`);
        
        if (existingUsers.length > 0) {
            console.log('Sample user structure:');
            console.log(JSON.stringify(existingUsers[0].toJSON(), null, 2));
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

debugArtist()
    .then(() => {
        console.log('\n✨ Debug completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n�� Debug failed:', error);
        process.exit(1);
    });
