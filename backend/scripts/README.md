# Johannesburg Venues Database Population Scripts

This directory contains scripts to populate your database with 20 real venues from Johannesburg North.

## 📁 Files

- **`venue_data.js`** - Contains all 20 venue data objects with real information
- **`populate_venues.js`** - Main script to populate the database
- **`test_venues.js`** - Test script to verify venue data
- **`README.md`** - This documentation file

## 🏢 Venues Included

The script creates 20 real venues in these Johannesburg North areas:

- **Sandton** (6 venues) - Convention centers, luxury hotels
- **Fourways** (3 venues) - Entertainment complexes, hotels
- **Rosebank** (2 venues) - Hotels, mall spaces
- **Westcliff** (2 venues) - Luxury hotels
- **Bryanston** (2 venues) - Country clubs, entertainment venues
- **Melrose Arch** (1 venue) - Urban event spaces
- **Hyde Park** (1 venue) - Shopping complex venues
- **Illovo** (1 venue) - Sports club
- **Sandhurst** (1 venue) - Boutique hotel
- **Kempton Park** (1 venue) - Casino complex
- **Dainfern** (1 venue) - Golf estate

## 🚀 How to Use

### 1. Test the Venue Data
```bash
cd backend
node scripts/test_venues.js
```

### 2. Populate the Database
```bash
cd backend
node scripts/populate_venues.js
```

## 📋 Prerequisites

- Database must be running and connected
- At least one user must exist in the database
- Models must be properly synced

## 🎯 What Each Venue Includes

- **Real Names** - Actual venue names from Johannesburg
- **Accurate Addresses** - Real street addresses with postal codes
- **GPS Coordinates** - Precise latitude/longitude for mapping
- **Contact Information** - Real phone numbers and email addresses
- **Website URLs** - Actual venue websites
- **Capacity Numbers** - Realistic venue capacities
- **High-Quality Images** - Professional venue photos from Unsplash
- **Detailed Descriptions** - Accurate venue descriptions

## 🔧 Customization

You can modify `venue_data.js` to:
- Add more venues
- Change venue details
- Update contact information
- Modify capacity numbers
- Change image URLs

## 📊 Expected Output

When running the populate script, you should see:
```
🚀 Starting venue population...
✅ Found user: [username]
✅ Using existing organiser: Johannesburg Venues
📋 Processing 20 venues...

✅ Created: Sandton Convention Centre (Sandton)
✅ Created: Montecasino (Fourways)
... (more venues)

🎉 Venue population completed!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Successfully created: 20 venues
⏭️  Skipped (already existed): 0 venues
❌ Errors: 0 venues
📊 Total processed: 20 venues
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Venues created in these areas:
   • Sandton: 6 venues
   • Fourways: 3 venues
   • Rosebank: 2 venues
   ... (more areas)
```

## 🚨 Troubleshooting

### Common Issues:

1. **"No users found"** - Create a user first
2. **Database connection errors** - Check your database connection
3. **Model sync issues** - Ensure models are properly synced
4. **Permission errors** - Check database user permissions

### Solutions:

1. Run your main application first to create users
2. Check database connection in your `.env` file
3. Ensure all models are imported and synced
4. Verify database user has CREATE permissions

## 🎉 Success!

After running the script, you'll have 20 real Johannesburg venues in your database, complete with:
- Professional images
- Accurate location data
- Real contact information
- Proper capacity numbers
- Detailed descriptions

These venues can now be used for events, venue browsing, and location-based features in your application!
