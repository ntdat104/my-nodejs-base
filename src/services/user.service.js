const User = require("../models/user.model");

class UserService {
  async findAll() {
    return User.find();
  }

  async create(user) {
    const newUser = new User(user);
    return newUser.save();
  }

  async findOneByUsername(username) {
    return User.findOne({ username });
  }

  async findOneByRefreshToken(refreshToken) {
    return User.findOne({ refreshToken });
  }

  async findOneById(id) {
    return User.findOne({ _id: id });
  }

  async delete(id) {
    return User.findByIdAndRemove(id);
  }

  async update(id, user) {
    return User.findByIdAndUpdate(id, user, { new: true });
  }
}

module.exports = new UserService();
