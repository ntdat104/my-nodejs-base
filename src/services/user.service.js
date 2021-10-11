const userModel = require("../models/user.model");

class UserService {
  async findAll() {
    return await userModel.find();
  }

  async create(user) {
    const newUser = new userModel(user);
    return await newUser.save();
  }

  async findOneByUsername(username) {
    return await userModel.findOne({ username });
  }

  async findOneByRefreshToken(refreshToken) {
    return await userModel.findOne({ refresh_token: refreshToken });
  }

  async findOneById(id) {
    return await userModel.findOne({ _id: id });
  }

  async delete(id) {
    return await userModel.findByIdAndRemove(id);
  }

  async update(id, user) {
    return await userModel.findByIdAndUpdate(id, user, { new: true });
  }
}

const userService = new UserService();

module.exports = userService;
