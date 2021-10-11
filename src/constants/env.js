require("dotenv").config();

const ENV = {
  // PORT
  PORT: process.env.PORT,

  // CORS_ORIGIN
  CORS_ORIGIN: process.env.CORS_ORIGIN,

  // MONGODB
  MONGODB_URL: process.env.MONGODB_URL,
  MONGODB_URL_LOCAL: process.env.MONGODB_URL_LOCAL,

  // BCRYPT
  SALT_ROUNDS: process.env.SALT_ROUNDS,

  // JWT
  ALGORITHM: process.env.ALGORITHM,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION,
};

module.exports = ENV;
