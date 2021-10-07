const userService = require("../services/user.service");
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
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

    // Get refreshToken
    const refreshToken = jwt.sign({ userId: newUser._id }, config.jwt_secret, {
      algorithm: "HS512",
      expiresIn: "1y",
    });

    // update refreshToken
    const updateUser = await userService.update(newUser._id, { refreshToken });

    return res.status(httpStatus.CREATED).json({ success: true, message: "User is created", data: updateUser });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Interal server error" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await userService.findOneByUsername(username);

  // check for existing user
  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Username is incorrect" });
  }

  // check password
  const passwordValid = await bcrypt.compare(password, user.hash);

  if (!passwordValid) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Password is incorrect" });
  }

  // Get accessToken
  const accessToken = jwt.sign({ userId: user._id }, config.jwt_secret, { algorithm: "HS512", expiresIn: "15s" });

  return res
    .status(httpStatus.OK)
    .json({ success: true, message: "Login success!", accessToken, refreshToken: user.refreshToken });
};

const token = async (req, res) => {
  const refreshTokenHeader = req.header("RefreshToken");
  const refreshToken = refreshTokenHeader && refreshTokenHeader.split(" ")[1];

  if (!refreshToken) {
    return res.status(httpStatus.FORBIDDEN).json({ success: false });
  }

  const user = await userService.findOneByRefreshToken(refreshToken);

  // check for existing user
  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "refreshToken is incorrect" });
  }

  // Get refreshToken
  const newRefreshToken = jwt.sign({ userId: user._id }, config.jwt_secret, {
    algorithm: "HS512",
    expiresIn: "1y",
  });

  // update refreshToken
  const updateUser = await userService.update(user._id, { refreshToken: newRefreshToken });

  // Get accessToken
  const accessToken = jwt.sign({ userId: updateUser._id }, config.jwt_secret, {
    algorithm: "HS512",
    expiresIn: "15s",
  });

  return res.status(httpStatus.OK).json({ success: true, userId: updateUser._id, accessToken });
};

module.exports = {
  register,
  login,
  token,
};
