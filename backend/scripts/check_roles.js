const db = require('../models');

async function checkRoles() {
    try {
        const roles = await db.acl_trust.findAll();
        console.log('Available roles:');
        roles.forEach(role => {
            console.log(`ID: ${role.acl_id}, Name: ${role.acl_name}, Display: ${role.acl_display}`);
        });
    } catch (error) {
        console.error('Error checking roles:', error);
    } finally {
        process.exit();
    }
}

checkRoles();

