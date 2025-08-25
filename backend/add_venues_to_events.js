const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('./config/db.config.js');

// Create Sequelize instance
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false
});

// Import models
const Venue = require('./models/venue.model.js')(sequelize, DataTypes);
const Event = require('./models/event.model.js')(sequelize, DataTypes);

async function addVenuesToEvents() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Sample venues in Johannesburg area
    const sampleVenues = [
      {
        name: 'Sandton Convention Centre',
        location: 'Sandton, Johannesburg',
        address: '161 Maude St, Sandown, Sandton, 2196',
        latitude: -26.1087,
        longitude: 28.0567,
        capacity: 5000,
        contact_email: 'sandton@example.com',
        phone_number: '+27 11 779 0000',
        website: 'https://www.sandtonconvention.co.za',
        owner_id: 1,
        owner_type: 'organiser'
      },
      {
        name: 'Montecasino',
        location: 'Fourways, Johannesburg',
        address: '1 Montecasino Blvd, Fourways, Johannesburg, 2055',
        latitude: -26.0167,
        longitude: 28.0000,
        capacity: 3000,
        contact_email: 'montecasino@example.com',
        phone_number: '+27 11 510 7000',
        website: 'https://www.montecasino.co.za',
        owner_id: 1,
        owner_type: 'organiser'
      },
      {
        name: 'Gold Reef City',
        location: 'Orlando, Johannesburg',
        address: 'Northern Parkway, Ormonde, Johannesburg, 2001',
        latitude: -26.2333,
        longitude: 27.9833,
        capacity: 2000,
        contact_email: 'goldreef@example.com',
        phone_number: '+27 11 248 5000',
        website: 'https://www.goldreefcity.co.za',
        owner_id: 1,
        owner_type: 'organiser'
      },
      {
        name: 'Emperors Palace',
        location: 'Kempton Park, Johannesburg',
        address: '64 Jones Rd, Kempton Park, Johannesburg, 1620',
        latitude: -26.1167,
        longitude: 28.2333,
        capacity: 4000,
        contact_email: 'emperors@example.com',
        phone_number: '+27 11 928 1000',
        website: 'https://www.emperorspalace.co.za',
        owner_id: 1,
        owner_type: 'organiser'
      },
      {
        name: 'The Dome',
        location: 'Northgate, Johannesburg',
        address: 'Northgate Shopping Centre, Northgate, Johannesburg, 2165',
        latitude: -26.0500,
        longitude: 27.9500,
        capacity: 1500,
        contact_email: 'thedome@example.com',
        phone_number: '+27 11 794 5800',
        website: 'https://www.thedome.co.za',
        owner_id: 1,
        owner_type: 'organiser'
      }
    ];

    // Create venues
    console.log('📍 Creating venues...');
    const createdVenues = [];
    for (const venueData of sampleVenues) {
      const venue = await Venue.create(venueData);
      createdVenues.push(venue);
      console.log(`✅ Created venue: ${venue.name}`);
    }

    // Get existing events
    const events = await Event.findAll();
    console.log(`📅 Found ${events.length} events`);

    // Assign venues to events
    console.log('🔗 Assigning venues to events...');
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const venueIndex = i % createdVenues.length;
      const venue = createdVenues[venueIndex];
      
      await event.update({ venue_id: venue.id });
      console.log(`✅ Assigned ${venue.name} to event: ${event.name}`);
    }

    console.log('🎉 Successfully added venues to events!');
    console.log('🗺️  Your map should now show event markers!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

addVenuesToEvents();
