const jwt = require("jsonwebtoken");
const ENV = require("../constants/env");

const JWT_SECRET = ENV.JWT_SECRET;
const ALGORITHM = ENV.ALGORITHM;
const JWT_ACCESS_EXPIRATION = ENV.JWT_ACCESS_EXPIRATION;
const JWT_REFRESH_EXPIRATION = ENV.JWT_REFRESH_EXPIRATION;

class JwtService {
  constructor() {}

  signAccessToken = (object) => {
    return jwt.sign(object, JWT_SECRET, { algorithm: ALGORITHM, expiresIn: JWT_ACCESS_EXPIRATION });
  };

  signRefreshToken = (object) => {
    return jwt.sign(object, JWT_SECRET, { algorithm: ALGORITHM, expiresIn: JWT_REFRESH_EXPIRATION });
  };

  verify = (token) => {
    return jwt.verify(token, JWT_SECRET);
  };
}

const jwtService = new JwtService();

module.exports = jwtService;
