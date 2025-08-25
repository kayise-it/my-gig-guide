const db = require('../models');
const bcrypt = require('bcryptjs');

async function resetUserPassword() {
    try {
        const email = process.argv[2];
        const newPassword = process.argv[3] || 'password123';

        if (!email) {
            console.log('❌ Usage: node reset_user_password.js <email> [new_password]');
            console.log('Example: node reset_user_password.js thandov.hlophe@gmail.com newpassword123');
            process.exit(1);
        }

        console.log(`🔍 Looking for user with email: ${email}`);

        const user = await db.user.findOne({ where: { email } });

        if (!user) {
            console.log('❌ User not found with that email address');
            process.exit(1);
        }

        console.log(`✅ Found user: ${user.username} (ID: ${user.id})`);
        console.log(`🔄 Resetting password to: ${newPassword}`);

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        await user.update({ password: hashedPassword });

        console.log('✅ Password reset successfully!');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 New password: ${newPassword}`);
        console.log('💡 You can now login with these credentials');

    } catch (error) {
        console.error('❌ Error resetting password:', error);
    } finally {
        process.exit();
    }
}

resetUserPassword();
