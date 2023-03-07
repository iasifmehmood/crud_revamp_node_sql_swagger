const logger = require("../logger");
const password_schema = require("../services/passwordValidation");
const email_validator = require("../services/emailValidation");

exports.signUpvalidationCheck = (req, res, next) => {
  console.log("validation started");
  const { email, confirm_password, password, cnic } = req.body;
  console.log(confirm_password, password);
  if (!(confirm_password === password)) {
    return res.status(400).json({
      message: "password does not match re-enter password password ",
    });
  }
  if (!(cnic.length === 13 && !cnic.match(/^[0-9]+$/) != null)) {
    logger.info("incorrect cnic, enter 13 digit cnic");
    return res.status(400).json({
      message: "incorrect cnic or enter 13 digit cnic",
    });
  }
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
