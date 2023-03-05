const logger = require("../logger");
const { signupModel } = require("../model/userModels");
const sendMail = require("./sendMailController");
const connection = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

/*************************Register************** */

const signup = async (req, res) => {
  const registration_data = req.body;
  await signupModel(registration_data, res);
  // logger.info(rows);
};

const login = async (req, res) => {
  const secretKey = process.env.secretKey;
  try {
    const { email, password } = req.body;
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
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
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
  } catch (err) {
    logger.info(err);
  }
};

const userProfile = (req, res) => {
  const secretKey = process.env.secretKey;
  logger.info(req.token);
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      res.send({ result: "invalid token" });
    } else {
      res.json({
        message: "token is valid",
        authData,
      });
    }
  });
};

const logout = (req, res) => {
  res.cookie("userRegistered", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  res.send("logged out succesfully");
};
module.exports = {
  signup,
  login,
  userProfile,
  logout,
};
