const express = require("express");
const { validate } = require("../middlewares");
const { authValidation } = require("../validations");
const { authController } = require("../controllers");
const router = express.Router();

router.post("/register", validate(authValidation.register()), authController.register);

router.post("/login", validate(authValidation.login()), authController.login);

router.get("/test", (req, res) => {
  res.send("OK");
});

module.exports = router;
