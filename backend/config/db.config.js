//File location: 
module.exports = {
  HOST: process.env.DB_HOST || "127.0.0.1",
  PORT: parseInt(process.env.DB_PORT || "3306", 10),
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "",
  DB: process.env.DB_NAME || "mygigguide",
  dialect: process.env.DB_DIALECT || "mysql",
};