//File location: backend/config/db.config.js
// ===========================================
// DATABASE CONFIGURATION
// ===========================================

module.exports = {
  // Local VPS Configuration (using socket)
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "thando",
  PASSWORD: process.env.DB_PASSWORD || "Gu3ssWh@t",
  DB: process.env.DB_NAME || "mygigguide",
  dialect: process.env.DB_DIALECT || "mysql",
  dialectOptions: {
    socketPath: '/run/mysqld/mysqld.sock'
  },
  
  // Render Configuration (commented for easy revert)
  // HOST: process.env.DB_HOST || "your_vps_db_host",
  // USER: process.env.DB_USER || "your_vps_db_user", 
  // PASSWORD: process.env.DB_PASSWORD || "your_vps_db_password",
  // DB: process.env.DB_NAME || "your_vps_db_name",
};