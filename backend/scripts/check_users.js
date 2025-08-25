const db = require('../models');

async function checkUsers() {
    try {
        const users = await db.user.findAll({
            include: [{
                model: db.acl_trust,
                as: 'aclInfo',
                attributes: ['acl_name', 'acl_display']
            }]
        });
        
        console.log('Available users:');
        users.forEach(user => {
            console.log(`Username: ${user.username}, Role: ${user.role} (${user.aclInfo?.acl_display || 'Unknown'}), Email: ${user.email}`);
        });
    } catch (error) {
        console.error('Error checking users:', error);
    } finally {
        process.exit();
    }
}

checkUsers();

