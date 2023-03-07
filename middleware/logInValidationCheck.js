const logger = require("../logger");
const password_schema = require("../services/passwordValidation");
const email_validator = require("../services/emailValidation");

exports.logInvalidationCheck = (req, res, next) => {
  console.log("validation started");
  const { email, password } = req.body;
  if (!email_validator.validate(email)) {
    logger.info(
      "Incorrect email format. Email format should be:asif@email.com "
    );
    return res.status(400).json({
      status: "incorrect email format",
      message: "email format should be: asif@email.com  ",
    });
  }
  if (!password_schema.validate(password)) {
    logger.info(
      "Password must have min 8 character and must contain (Uppercase,Lowercase and digits only)  "
    );
    return res.status(400).json({
      status: "incorrect password format",
      message:
        "Password must have min 8 character and must contain (Uppercase,Lowercase and digits only) ",
    });
  }

  next();
};
