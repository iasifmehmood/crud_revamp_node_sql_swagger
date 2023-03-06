const bcrypt = require("bcrypt");
const connection = require("../config/db");
const logger = require("../logger");
const password_schema = require("../middleware/passwordValidation");
const email_validator = require("../middleware/emailValidation");
const jwt = require("jsonwebtoken");

exports.loginModel = async (email, password, secretKey, res) => {
  try {
    if (email_validator.validate(email)) {
      if (password_schema.validate(password)) {
        if (!email || !password) {
          return res.status(400).json({
            message: "Please Provide an email and password",
          });
        }
        await connection.query(
          "SELECT * FROM users WHERE email = ?",
          [email],
          async (err, results) => {
            logger.info(results);
            if (
              !results ||
              !(await bcrypt.compare(password, results[0].password))
            ) {
              res.status(401).json({
                message: "Email or Password is incorrect",
              });
            } else {
              const id = results[0].id;

              const token = jwt.sign({ id, email }, secretKey, {
                expiresIn: process.env.JWT_EXPIRES,
              });

              logger.info("the token has been generated " + token);

              const cookieOptions = {
                expires: new Date(
                  Date.now() +
                    process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ), //converted into milli sec
                httpOnly: true,
              };
              res.cookie("userRegistered", token, cookieOptions);
              res.status(200).json({
                status: "success",
                sucess: "User has been logged in",
              });
            }
          }
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
  } catch (err) {
    logger.info(err);
  }
};
