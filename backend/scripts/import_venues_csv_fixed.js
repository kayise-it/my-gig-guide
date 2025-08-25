const db = require('../models');
const fs = require('fs');
const path = require('path');

async function importVenuesFromCSV() {
    try {
        console.log('🚀 Starting CSV venue import...');
        
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
                name: 'CSV Imported Venues',
                userId: user.id,
                contact_email: 'venues@imported.co.za',
                phone_number: '+27 11 123 4567'
            });
            console.log(`✅ Created organiser: ${organiser.name}`);
        } else {
            console.log(`✅ Using existing organiser: ${organiser.name}`);
        }

        const csvFilePath = '/Users/thandohlophe/Downloads/venues.csv';
        
        if (!fs.existsSync(csvFilePath)) {
            console.error(`❌ CSV file not found at: ${csvFilePath}`);
            return;
        }

        // Read the CSV file manually
        const content = fs.readFileSync(csvFilePath, 'utf8');
        const lines = content.split('\n');
        
        console.log(`📋 Total lines in file: ${lines.length}`);

        const venues = [];
        let rowCount = 0;
        let validVenues = 0;
        let invalidVenues = 0;

        // Process each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            rowCount++;
            
            // Skip empty lines
            if (!line || line === '') {
                continue;
            }
            
            // Split by semicolon and remove empty first column
            const columns = line.split(';').filter(col => col !== '');
            
            // Skip header line and "New Venue" line
            if (columns[0] === 'Venue' || columns[0] === 'New Venue') {
                console.log(`⏭️  Skipping header line: ${columns[0]}`);
                continue;
            }
            
            // Skip lines with insufficient data
            if (columns.length < 2) {
                continue;
            }

            // Parse the venue data
            const venueName = columns[0]?.trim();
            const address = columns[1]?.trim();
            const phoneNumber = columns[2]?.trim();
            const email = columns[3]?.trim();
            const website = columns[4]?.trim();
            const facebook = columns[5]?.trim();
            const twitter = columns[6]?.trim();
            const instagram = columns[7]?.trim();
            const latLong = columns[8]?.trim();
            const description = columns[9]?.trim();

            // Parse latitude and longitude
            let latitude = null;
            let longitude = null;
            
            if (latLong && latLong.trim() !== '') {
                const latLongMatch = latLong.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
                if (latLongMatch) {
                    latitude = parseFloat(latLongMatch[1]);
                    longitude = parseFloat(latLongMatch[2]);
                }
            }

            // Validate venue data
            if (!venueName || venueName.length === 0) {
                invalidVenues++;
                continue;
            }

            const venueData = {
                name: venueName,
                address: address || null,
                phone_number: phoneNumber || null,
                contact_email: email || null,
                website: website || null,
                latitude: latitude,
                longitude: longitude,
                location: getLocationFromCoordinates(latitude, longitude),
                capacity: 100, // Default capacity
                userId: user.id,
                owner_id: organiser.id,
                owner_type: 'organiser'
            };

            venues.push(venueData);
            validVenues++;
        }

        console.log(`📊 CSV Analysis Results:`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📋 Total rows processed: ${rowCount}`);
        console.log(`✅ Valid venues found: ${validVenues}`);
        console.log(`❌ Invalid venues: ${invalidVenues}`);
        console.log(`📊 Success rate: ${((validVenues / (validVenues + invalidVenues)) * 100).toFixed(1)}%`);

        if (venues.length > 0) {
            console.log(`\n📍 Sample venues:`);
            venues.slice(0, 5).forEach((venue, index) => {
                console.log(`   ${index + 1}. ${venue.name}`);
                console.log(`      📍 Address: ${venue.address || 'N/A'}`);
                console.log(`      📞 Phone: ${venue.phone_number || 'N/A'}`);
                console.log(`      📧 Email: ${venue.contact_email || 'N/A'}`);
                console.log(`      🌐 Website: ${venue.website || 'N/A'}`);
                console.log(`      📍 Coordinates: ${venue.latitude}, ${venue.longitude}`);
                console.log(`      📍 Location: ${venue.location}`);
                console.log('');
            });
        }

        let createdCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        console.log(`\n📋 Processing ${venues.length} venues for database import...\n`);

        for (const venueData of venues) {
            try {
                // Check if venue already exists by name
                const existingVenue = await db.venue.findOne({
                    where: { name: venueData.name }
                });

                if (existingVenue) {
                    console.log(`⏭️  Skipping: ${venueData.name} (already exists)`);
                    skippedCount++;
                    continue;
                }

                // Create the venue
                const venue = await db.venue.create(venueData);

                console.log(`✅ Created: ${venue.name} (${venue.location || 'No location'})`);
                createdCount++;

            } catch (error) {
                console.error(`❌ Error creating "${venueData.name}":`, error.message);
                errorCount++;
            }
        }

        console.log('\n🎉 CSV venue import completed!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Successfully created: ${createdCount} venues`);
        console.log(`⏭️  Skipped (already existed): ${skippedCount} venues`);
        console.log(`❌ Errors: ${errorCount} venues`);
        console.log(`📊 Total processed: ${venues.length} venues`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        if (createdCount > 0) {
            console.log('\n📍 Venues created in these areas:');
            const locations = [...new Set(venues.map(v => v.location).filter(l => l))];
            locations.forEach(location => {
                const count = venues.filter(v => v.location === location).length;
                console.log(`   • ${location}: ${count} venues`);
            });
        }

    } catch (error) {
        console.error('❌ Fatal error in CSV import process:', error);
    }
}

// Helper function to determine location based on coordinates
function getLocationFromCoordinates(lat, lng) {
    if (!lat || !lng) return 'Unknown';
    
    // Define approximate boundaries for major areas
    const areas = {
        'Pretoria': { lat: [-25.9, -25.6], lng: [28.1, 28.4] },
        'Johannesburg': { lat: [-26.3, -25.9], lng: [27.9, 28.2] },
        'Centurion': { lat: [-25.9, -25.8], lng: [28.1, 28.2] },
        'Krugersdorp': { lat: [-26.2, -26.0], lng: [27.7, 27.9] },
        'Randburg': { lat: [-26.1, -26.0], lng: [27.9, 28.0] },
        'Sandton': { lat: [-26.1, -26.0], lng: [28.0, 28.1] },
        'Fourways': { lat: [-26.1, -25.9], lng: [27.9, 28.1] },
        'Boksburg': { lat: [-26.3, -26.1], lng: [28.2, 28.3] },
        'Benoni': { lat: [-26.2, -26.1], lng: [28.3, 28.4] },
        'Kempton Park': { lat: [-26.1, -26.0], lng: [28.2, 28.3] },
        'Hartbeespoort': { lat: [-25.8, -25.6], lng: [27.7, 27.9] },
        'Vanderbijlpark': { lat: [-26.8, -26.6], lng: [27.8, 27.9] },
        'Alberton': { lat: [-26.3, -26.2], lng: [28.1, 28.2] }
    };

    for (const [area, bounds] of Object.entries(areas)) {
        if (lat >= bounds.lat[0] && lat <= bounds.lat[1] && 
            lng >= bounds.lng[0] && lng <= bounds.lng[1]) {
            return area;
        }
    }

    return 'Other';
}

// Run the script
if (require.main === module) {
    importVenuesFromCSV()
        .then(() => {
            console.log('\n✨ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Script failed:', error);
            process.exit(1);
        });
}

module.exports = { importVenuesFromCSV };

