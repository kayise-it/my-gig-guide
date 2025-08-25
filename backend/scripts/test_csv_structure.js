const fs = require('fs');
const csv = require('csv-parser');

async function testCSVStructure() {
    try {
        console.log('🔍 Testing CSV structure...');
        
        const csvFilePath = '/Users/thandohlophe/Downloads/venues.csv';
        
        if (!fs.existsSync(csvFilePath)) {
            console.error(`❌ CSV file not found at: ${csvFilePath}`);
            return;
        }

        const venues = [];
        let rowCount = 0;
        let validVenues = 0;
        let invalidVenues = 0;

        // Read and parse CSV file
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvFilePath)
                .pipe(csv({ separator: ';' }))
                .on('data', (row) => {
                    rowCount++;
                    
                    // Log the first few rows to see structure
                    if (rowCount <= 10) {
                        console.log(`\n📋 Row ${rowCount}:`, JSON.stringify(row, null, 2));
                    }
                    
                    // Skip empty rows or header rows
                    if (!row.Venue || row.Venue.trim() === '' || row.Venue === 'Venue' || row.Venue === 'New Venue') {
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

                    const venueData = {
                        name: row.Venue.trim(),
                        address: row.Address ? row.Address.trim() : null,
                        phone_number: row['Contact Number '] ? row['Contact Number '].trim() : null,
                        contact_email: row.Email ? row.Email.trim() : null,
                        website: row.Website ? row.Website.trim() : null,
                        facebook: row.FB ? row.FB.trim() : null,
                        twitter: row.X ? row.X.trim() : null,
                        instagram: row.IG ? row.IG.trim() : null,
                        latitude: latitude,
                        longitude: longitude
                    };

                    // Validate venue data
                    if (venueData.name && venueData.name.length > 0) {
                        venues.push(venueData);
                        validVenues++;
                    } else {
                        invalidVenues++;
                    }
                })
                .on('end', () => {
                    console.log(`\n📊 CSV Analysis Results:`);
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
                            console.log('');
                        });
                        
                        console.log(`\n📍 Location distribution:`);
                        const locations = {};
                        venues.forEach(venue => {
                            if (venue.latitude && venue.longitude) {
                                // Simple location detection
                                if (venue.latitude > -25.9) {
                                    locations['Pretoria'] = (locations['Pretoria'] || 0) + 1;
                                } else if (venue.latitude > -26.1) {
                                    locations['Johannesburg'] = (locations['Johannesburg'] || 0) + 1;
                                } else {
                                    locations['Other'] = (locations['Other'] || 0) + 1;
                                }
                            } else {
                                locations['No coordinates'] = (locations['No coordinates'] || 0) + 1;
                            }
                        });
                        
                        Object.entries(locations).forEach(([location, count]) => {
                            console.log(`   • ${location}: ${count} venues`);
                        });
                    }
                    
                    console.log(`\n✅ CSV structure test completed successfully!`);
                    resolve();
                })
                .on('error', (error) => {
                    console.error('❌ Error reading CSV file:', error);
                    reject(error);
                });
        });

    } catch (error) {
        console.error('❌ Fatal error in CSV structure test:', error);
    }
}

// Run the script
if (require.main === module) {
    testCSVStructure()
        .then(() => {
            console.log('\n✨ Test completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Test failed:', error);
            process.exit(1);
        });
}

module.exports = { testCSVStructure };
