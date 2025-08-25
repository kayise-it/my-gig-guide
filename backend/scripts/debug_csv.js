const fs = require('fs');

function debugCSV() {
    try {
        console.log('🔍 Debugging CSV file structure...');
        
        const csvFilePath = '/Users/thandohlophe/Downloads/venues.csv';
        
        if (!fs.existsSync(csvFilePath)) {
            console.error(`❌ CSV file not found at: ${csvFilePath}`);
            return;
        }

        // Read the first 20 lines of the file
        const content = fs.readFileSync(csvFilePath, 'utf8');
        const lines = content.split('\n');
        
        console.log(`📋 Total lines in file: ${lines.length}`);
        console.log(`\n📋 First 20 lines:`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        lines.slice(0, 20).forEach((line, index) => {
            console.log(`Line ${index + 1}: "${line}"`);
        });
        
        // Try to find the header line
        console.log(`\n🔍 Looking for header line...`);
        lines.forEach((line, index) => {
            if (line.includes('Venue') && line.includes('Address')) {
                console.log(`✅ Found header at line ${index + 1}: "${line}"`);
            }
        });
        
        // Count semicolons in each line to understand structure
        console.log(`\n📊 Semicolon count analysis (first 20 lines):`);
        lines.slice(0, 20).forEach((line, index) => {
            const semicolonCount = (line.match(/;/g) || []).length;
            console.log(`Line ${index + 1}: ${semicolonCount} semicolons`);
        });

    } catch (error) {
        console.error('❌ Error debugging CSV file:', error);
    }
}

// Run the script
if (require.main === module) {
    debugCSV();
    console.log('\n✨ Debug completed');
    process.exit(0);
}

module.exports = { debugCSV };

