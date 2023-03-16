const logger = require("../logger");
const password_schema = require("../services/passwordValidation");

exports.resetPasswordCheck = (req, res, next) => {
  logger.info("validation started");
  const { email, confirm_password, password } = req.body;

  if (confirm_password != password) {
    return res.status(400).json({
      status: "fail",
      message: "password does not match re-enter password password ",
    });
  }

  if (!password_schema.validate(password)) {
    return res.status(400).json({
      status: "fail",
      message:
        "incorrect password format: Password must have min 8 character and must contain (Uppercase,Lowercase and digits only) ",
    });
  }

  next();
};
