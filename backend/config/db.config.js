//File location: 
module.exports = {
  HOST: process.env.DB_HOST || "127.0.0.1",
  PORT: parseInt(process.env.DB_PORT || "3306", 10),
  USER: process.env.DB_USER || "thando",
  PASSWORD: process.env.DB_PASSWORD || "Gu3ssWh@t",
  DB: process.env.DB_NAME || "mygigguide",
  dialect: process.env.DB_DIALECT || "mysql",
};