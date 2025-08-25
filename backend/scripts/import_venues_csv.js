const db = require('../models');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

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

        const venues = [];
        let rowCount = 0;

        // Read and parse CSV file
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvFilePath)
                .pipe(csv({ separator: ';' }))
                .on('data', (row) => {
                    rowCount++;
                    
                    // Skip empty rows or header rows
                    if (!row.Venue || row.Venue.trim() === '' || row.Venue === 'Venue') {
                        return;
                    }

                    // Parse latitude and longitude from LatLong column
                    let latitude = null;
                    let longitude = null;
                    
                    if (row.LatLong && row.LatLong.trim() !== '') {
                        const latLongMatch = row.LatLong.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
                        if (latLongMatch) {
                            latitude = parseFloat(latLongMatch[1]);
                            longitude = parseFloat(latLongMatch[2]);
                        }
                    }

                    // Clean and validate data
                    const venueData = {
                        name: row.Venue.trim(),
                        address: row.Address ? row.Address.trim() : null,
                        phone_number: row['Contact Number '] ? row['Contact Number '].trim() : null,
                        contact_email: row.Email ? row.Email.trim() : null,
                        website: row.Website ? row.Website.trim() : null,
                        latitude: latitude,
                        longitude: longitude,
                        // Set default location based on coordinates or use a default
                        location: getLocationFromCoordinates(latitude, longitude),
                        // Set reasonable defaults for required fields
                        capacity: 100, // Default capacity
                        userId: user.id,
                        owner_id: organiser.id,
                        owner_type: 'organiser'
                    };

                    // Only add venues with at least a name
                    if (venueData.name && venueData.name.length > 0) {
                        venues.push(venueData);
                    }
                })
                .on('end', () => {
                    console.log(`📋 Parsed ${rowCount} rows from CSV`);
                    console.log(`📋 Found ${venues.length} valid venues`);
                    resolve();
                })
                .on('error', (error) => {
                    console.error('❌ Error reading CSV file:', error);
                    reject(error);
                });
        });

        let createdCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        console.log(`\n📋 Processing ${venues.length} venues...\n`);

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
        'Vanderbijlpark': { lat: [-26.8, -26.6], lng: [27.8, 27.9] }
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

