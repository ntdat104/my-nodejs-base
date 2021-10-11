const userService = require("../services/user.service");
const STATUS = require("../constants/status");
const bcryptService = require("../services/bcrypt.service");
const jwtService = require("../services/jwt.service");

class AuthController {
  register = async (req, res) => {
    const { username, password, name } = req.body;
    try {
      const user = await userService.findOneByUsername(username);

      // Check user has already taken
      if (user) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json({ code: STATUS.BAD_REQUEST, success: false, message: "User has already taken!" });
      }

      // Hash password & stored database
      const passwordHashed = await bcryptService.hash(password);
      const newUser = await userService.create({ username, hash: passwordHashed, name });

      // Generate refresh_token
      const refreshToken = jwtService.signRefreshToken({ userId: newUser._id, name: newUser.name });

      // Update user refresh_token
      const userUpdated = await userService.update(newUser._id, { refresh_token: refreshToken });

      return res.status(STATUS.CREATED).json({
        code: STATUS.CREATED,
        success: true,
        message: "User is created",
        user: { id: userUpdated._id, name: userUpdated.name },
      });
    } catch (e) {
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .json({ code: STATUS.INTERNAL_SERVER_ERROR, success: false, message: "INTERNAL SERVER ERROR" });
    }
  };

  login = async (req, res) => {
    const { username, password } = req.body;
    const user = await userService.findOneByUsername(username);

    // Check for existing user
    if (!user) {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ code: STATUS.UNAUTHORIZED, success: false, message: "username is incorrect" });
    }

    // Check password
    const isMatch = await bcryptService.compare(password, user.hash);
    if (!isMatch) {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ code: STATUS.UNAUTHORIZED, success: false, message: "password is incorrect" });
    }

    // Generate access_token
    const accessToken = jwtService.signAccessToken({ userId: user._id, name: user.name });

    return res.status(STATUS.OK).json({
      code: STATUS.OK,
      success: true,
      message: "Login successfully!",
      accessToken,
      refreshToken: user.refresh_token,
    });
  };

  token = async (req, res) => {
    const refreshTokenHeader = req.header("Refreshtoken");
    const refreshToken = refreshTokenHeader && refreshTokenHeader.split(" ")[1];

    // Check for existing refresh_token
    if (!refreshToken) {
      return res.status(STATUS.FORBIDDEN).json({ code: STATUS.FORBIDDEN, success: false });
    }

    const user = await userService.findOneByRefreshToken(refreshToken);

    // Check for existing user
    if (!user) {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ code: STATUS.UNAUTHORIZED, success: false, message: "Refreshtoken is incorrect" });
    }

    // Generate new refresh_token
    const newRefreshToken = jwtService.signRefreshToken({ userId: user._id, name: user.name });

    // Update refresh_token
    const userUpdated = await userService.update(user._id, { refresh_token: newRefreshToken });

    // Generate access_token
    const accessToken = jwtService.signAccessToken({ userId: userUpdated._id, name: userUpdated.name });

    return res
      .status(STATUS.OK)
      .json({ code: STATUS.OK, success: true, user: { id: userUpdated._id, name: userUpdated.name }, accessToken });
  };
}

const authController = new AuthController();

module.exports = authController;
