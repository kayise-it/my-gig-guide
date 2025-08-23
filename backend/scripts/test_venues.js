const { johannesburgVenues } = require('./venue_data');

console.log('🏢 Johannesburg North Venues Data');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Total venues: ${johannesburgVenues.length}\n`);

johannesburgVenues.forEach((venue, index) => {
    console.log(`${index + 1}. ${venue.name}`);
    console.log(`   📍 Location: ${venue.location}`);
    console.log(`   👥 Capacity: ${venue.capacity} people`);
    console.log(`   📧 Email: ${venue.contact_email}`);
    console.log(`   📱 Phone: ${venue.phone_number}`);
    console.log(`   🌐 Website: ${venue.website}`);
    console.log(`   📍 Address: ${venue.address}`);
    console.log(`   📍 Coordinates: ${venue.latitude}, ${venue.longitude}`);
    console.log(`   📝 Description: ${venue.description}`);
    console.log(`   🖼️  Image: ${venue.main_picture}`);
    console.log('');
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ Venue data loaded successfully!');
