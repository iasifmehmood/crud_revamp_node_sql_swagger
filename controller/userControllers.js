const logger = require("../logger");
const { signupModel, loginModel } = require("../model/userModels");
const sendMail = require("./sendMailController");
const connection = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

/*************************Register************** */

const signup = async (req, res) => {
  try {
    const registration_data = req.body;
    const [results] = await signupModel(registration_data, res);
    if (results.affectedRows == 1) {
      res.status(200).json({
        status: "success",
        message: "record is added succesfully",
      });
      // sendMail(registration_data.email);
    }
    logger.info(results);
  } catch (error) {
    logger.info("error");
  }
};

const login = async (req, res) => {
  const secretKey = process.env.secretKey;
  try {
    const { email, password } = req.body;
    await loginModel(email, password, secretKey, res);
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
