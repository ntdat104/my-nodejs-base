const express = require("express");
const router = express.Router();
const STATUS = require("../constants/status");
const jwtService = require("../services/jwt.service");

router.get("/", (req, res) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  // Check for existing token
  if (!token) {
    return res
      .status(STATUS.UNAUTHORIZED)
      .json({ code: STATUS.UNAUTHORIZED, success: false, token: "token is required" });
  }

  try {
    const decoded = jwtService.verify(token);
    return res
      .status(STATUS.OK)
      .json({ code: STATUS.OK, success: true, user: { id: decoded.userId, name: decoded.name } });
  } catch (e) {
    return res.status(STATUS.FORBIDDEN).json({ code: STATUS.FORBIDDEN, success: false, message: e.name });
  }
});

module.exports = router;
