const logger = require("../logger");
const password_schema = require("../services/passwordValidation");
const email_validator = require("../services/emailValidation");

exports.signUpvalidationCheck = (req, res, next) => {
  logger.info("validation started");
  const { email, confirm_password, password, cnic } = req.body;
  if (!(confirm_password === password)) {
    return res.status(400).json({
      status: "fail",
      message: "password does not match re-enter password password ",
    });
  }
  if (!(cnic.length === 13 && cnic.match(/^[0-9]+$/) != null)) {
    return res.status(400).json({
      status: "fail",
      message: "incorrect cnic or enter 13 digit cnic",
    });
  }
  if (!email_validator.validate(email)) {
    return res.status(400).json({
      status: "fail",
      message:
        "incorrect email format: email format should be: asif@email.com  ",
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
