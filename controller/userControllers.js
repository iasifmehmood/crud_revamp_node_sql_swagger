const logger = require("../logger");
const { signupModel, loginModel } = require("../model/userModels");
const sendMail = require("./sendMailController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const signup = async (req, res) => {
  try {
    const registration_data = req.body;
    const [results] = await signupModel(registration_data);
    if (results.affectedRows == 1) {
      res.status(200).json({
        status: "success",
        message: "record is added succesfully",
      });
      sendMail(registration_data.email);
    }
    logger.info(results);
  } catch (error) {
    logger.error("error");
    return res.status(400).json({
      status: "fail",
      message:
        error.message + " Inserted data is not correct or already exists",
    });
  }
};

const login = async (req, res) => {
  try {
    const secretKey = process.env.secretKey;
    const { email, password } = req.body;
    const [results] = await loginModel(email);

    if (!email || !password) {
      return res.status(400).json({
        message: "Please Provide an email and password",
      });
    }

    logger.info(results);
    if (!results || !(await bcrypt.compare(password, results[0].password))) {
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
      res.header("auth-token", token).status(200).json({
        token,
        status: "success (token in header)",
        success: "User has been logged in",
      });
      res.end();
    }
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
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
