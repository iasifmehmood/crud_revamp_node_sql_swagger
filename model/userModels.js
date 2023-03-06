const bcrypt = require("bcrypt");
const connection = require("../config/db");
const logger = require("../logger");
const password_schema = require("../middleware/passwordValidation");
const email_validator = require("../middleware/emailValidation");
const jwt = require("jsonwebtoken");

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
            return await connection.promise().query(
              insert_query, //2. saving in database
              data
            );
          } else {
            logger.info(
              "Password must have min 8 character and must contain (Uppercase,Lowercase and digits only)  "
            );
            return res.status(400).json({
              status: "incorrect password format",
              message:
                "Password must have min 8 character and must contain (Uppercase,Lowercase and digits only) ",
            });
          }
        } else {
          logger.info(
            "Incorrect email format. Email format should be:asif@email.com "
          );
          return res.status(400).json({
            status: "incorrect email format",
            message: "email format should be: asif@email.com  ",
          });
        }
      } else {
        logger.info("incorrect cnic, enter 13 digit cnic");
        return res.status(400).json({
          message: "incorrect cnic or enter 13 digit cnic",
        });
      }
    } else {
      logger.info("password does not match re-enter password");
      return res.status(400).json({
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

exports.loginModel = async (email, password, secretKey, res) => {
  try {
    if (email_validator.validate(email)) {
      if (password_schema.validate(password)) {
        if (!email || !password) {
          return res.status(400).json({
            message: "Please Provide an email and password",
          });
        }
        connection.query(
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
              res.end();
            }
          }
        );
      } else {
        logger.info(
          "Password must have min 8 character and must contain (Uppercase,Lowercase and digits only)  "
        );
        res.status(400).json({
          status: "incorrect password format",
          message:
            "Password must have min 8 character and must contain (Uppercase,Lowercase and digits only) ",
        });
      }
    } else {
      logger.info(
        "Incorrect email format. Email format should be:asif@email.com "
      );
      res.status(400).json({
        status: "incorrect email format",
        message: "email format should be: asif@email.com  ",
      });
    }
  } catch (err) {
    logger.info(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
