const { userService } = require("../services");
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const { configs } = require("../configs");
const bcrypt = require("bcrypt");

class AuthController {
  async register(req, res) {
    const { username, password, name } = req.body;
    try {
      let user = await userService.findOneByUsername(username);

      // Check user has already taken
      if (user) {
        return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: "User has already taken!" });
      }

      // Hash password & stored database
      const hash = await bcrypt.hash(password, 10);
      const newUser = await userService.create({ username, hash, name });

      // Get accessToken
      const accessToken = jwt.sign({ userId: newUser._id }, configs.jwt_secret, {
        algorithm: "HS512",
        expiresIn: "15s",
      });

      return res.status(httpStatus.CREATED).json({ success: true, message: "User is created", accessToken });
    } catch (e) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Interal server error" });
    }
  }

  async login(req, res) {
    const { username, password } = req.body;
    const user = await userService.findOneByUsername(username);

    // check for existing user
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "wrong username" });
    }

    // check password
    const passwordValid = await bcrypt.compare(password, user.hash);

    if (!passwordValid) {
      return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "wrong password" });
    }

    // Get accessToken
    const accessToken = jwt.sign({ userId: user._id }, configs.jwt_secret, { algorithm: "HS512", expiresIn: "15s" });

    return res.status(httpStatus.OK).json({ success: true, message: "Login success!", accessToken });
  }
}

module.exports = new AuthController();
