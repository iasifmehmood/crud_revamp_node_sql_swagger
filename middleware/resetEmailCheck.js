const logger = require("../logger");
const email_validator = require("../services/emailValidation");

exports.resetEmailCheck = (req, res, next) => {
  logger.info("validation started");
  const { email, confirm_password, password } = req.body;

  if (!email_validator.validate(email)) {
    return res.status(400).json({
      status: "fail",
      message:
        "incorrect email format: email format should be: asif@email.com  ",
    });
  }

  next();
};
