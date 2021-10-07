const express = require("express");
const router = express.Router();
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const config = require("../configs/config");

router.get("/", (req, res) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false });
  }

  try {
    const decoded = jwt.verify(token, config.jwt_secret);
    return res.status(httpStatus.OK).json({ success: true, userId: decoded.userId });
  } catch (e) {
    return res.status(httpStatus.FORBIDDEN).json({ success: false, message: e.name });
  }
});

module.exports = router;
