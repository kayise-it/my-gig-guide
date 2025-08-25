const db = require('../models');
const bcrypt = require('bcryptjs');

async function resetPassword() {
    try {
        const username = process.argv[2];
        const newPassword = process.argv[3] || 'password123';
        
        if (!username) {
            console.log('Usage: node reset_password.js <username> [new_password]');
            console.log('Example: node reset_password.js Thando mynewpassword');
            process.exit(1);
        }

        // Find the user
        const user = await db.user.findOne({
            where: { username }
        });

        if (!user) {
            console.log(`❌ User "${username}" not found`);
            process.exit(1);
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update the user's password
        await user.update({ password: hashedPassword });

        console.log(`✅ Password for user "${username}" has been reset successfully`);
        console.log(`New password: ${newPassword}`);
        console.log(`Role: ${user.role}`);
        
    } catch (error) {
        console.error('❌ Error resetting password:', error);
    } finally {
        process.exit();
    }
}

resetPassword();
