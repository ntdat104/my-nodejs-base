const bcrypt = require("bcrypt");
const ENV = require("../constants/env");

// Get saltRounds
const SALT_ROUNDS = parseInt(ENV.SALT_ROUNDS) || 10;

class BcryptService {
  constructor() {}

  hash = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
  };

  compare = async (password, hash) => {
    return await bcrypt.compare(password, hash);
  };
}

const bcryptService = new BcryptService();

module.exports = bcryptService;
