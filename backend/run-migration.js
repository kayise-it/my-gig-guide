#!/usr/bin/env node

// Script to run all migrations
const createAclTrustsTable = require('./migrations/create_acl_trusts_table');
const migrateEventsTable = require('./migrations/update_events_table');
const migrateVenuesTable = require('./migrations/update_venues_table');
const updateVenueOwnerFields = require('./migrations/update_venue_owner_fields');
const createPaidFeaturesTables = require('./migrations/create_paid_features_tables');

async function runAllMigrations() {
  try {
    console.log('Starting All Migrations...');
    console.log('This will run all necessary database migrations.');
    console.log('');

    // Run ACL Trusts migration first
    console.log('1. Running ACL Trusts migration...');
    await createAclTrustsTable();
    console.log('');

    // Run Events migration
    console.log('2. Running Events table migration...');
    await migrateEventsTable();
    console.log('');

    // Run Venues migration
    console.log('3. Running Venues table migration...');
    await migrateVenuesTable();
    console.log('');

    // Run Venue Owner Fields migration
    console.log('4. Running Venue Owner Fields migration...');
    await updateVenueOwnerFields();
    console.log('');

    // Create Paid Features tables
    console.log('5. Creating Paid Features tables...');
    await createPaidFeaturesTables();
    console.log('');

    console.log('✅ All migrations completed successfully!');
    console.log('');
    console.log('Database structure is now up to date:');
    console.log('- acl_trusts table created and seeded with roles');
    console.log('- events table updated to use owner_id/owner_type');
    console.log('- venues table updated to use owner_id/owner_type');
    console.log('- venues table updated to allow null owner fields');
    console.log('- paid_features and purchased_features tables created and seeded');
    console.log('');
    console.log('You can now restart your backend server.');
    
  } catch (error) {
    console.error('');
    console.error('❌ Migration failed:', error.message);
    console.error('');
    console.error('Please check the error above and try again.');
    console.error('If you need to rollback, you may need to restore from a backup.');
    process.exit(1);
  }
}

runAllMigrations()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
