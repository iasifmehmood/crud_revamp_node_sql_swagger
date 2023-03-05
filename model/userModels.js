const bcrypt = require("bcrypt");
const connection = require("../config/db");
const logger = require("../logger");
const password_schema = require("../middleware/passwordValidation");
const email_validator = require("../middleware/emailValidation");

exports.signupModel = async (registration_data, res) => {
  const { email, confirm_password, password, cnic } = registration_data;
  try {
    if (confirm_password == password) {
      if (cnic.length === 13 && cnic.match(/^[0-9]+$/) != null) {
        registration_data.password = await bcrypt.hash(password, 13);

        const data = [email, registration_data.password, cnic];

        const insert_query =
          "INSERT into users (email,password,cnic) values(?,?,?)";

        if (email_validator.validate(email)) {
          if (password_schema.validate(password)) {
            await connection.promise().query(
              insert_query, //2. saving in database
              data
            );
          } else {
            logger.info(
              "Password must have min 8 character and must contain (Uppercase,Lowercase and digits only)  "
            );
            return res.status(403).json({
              status: "incorrect password format",
              message:
                "Password must have min 8 character and must contain (Uppercase,Lowercase and digits only) ",
            });
          }
        } else {
          logger.info(
            "Incorrect email format. Email format should be:asif@email.com "
          );
          return res.status(403).json({
            status: "incorrect email format",
            message: "email format should be: asif@email.com  ",
          });
        }
      } else {
        logger.info("incorrect cnic, enter 13 digit cnic");
        return res.status(403).json({
          message: "incorrect cnic or enter 13 digit cnic",
        });
      }
    } else {
      logger.info("password does not match re-enter password");
      return res.status(403).json({
        message: "password does not match re-enter password password ",
      });
    }
  } catch (error) {
    logger.error(error);
    return res.status(400).json({
      status: "fail",
      message:
        error.message + " Inserted data is not correct or already exists",
    });
  }
};
