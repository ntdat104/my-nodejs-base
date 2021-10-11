const Joi = require("joi");
const { password } = require("./custom.validation");

class AuthValidation {
  register = {
    body: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required().custom(password),
      name: Joi.string().required(),
    }),
  };

  login = {
    body: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required().custom(password),
    }),
  };
}

const authValidation = new AuthValidation();

module.exports = authValidation;
