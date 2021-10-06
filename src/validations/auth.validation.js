const Joi = require("joi");
const { password } = require("./custom.validation");

class AuthValidation {
  register() {
    return {
      body: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required().custom(password),
        name: Joi.string().required(),
      }),
    };
  }

  login() {
    return {
      body: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required().custom(password),
      }),
    };
  }
}

module.exports = new AuthValidation();
