const logger = require("../logger");
const {
  signupModel,
  loginModel,
  updatePassword,
} = require("../model/userModels");
const sendMail = require("./sendMailController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const { generateToken } = require("../services/generateToken");
const { decryptedPayload } = require("../services/generateToken");

const signup = async (req, res) => {
  try {
    const registration_data = req.body;
    const { email } = req.body;

    await signupModel(registration_data);

    const sent = await sendMail.sendRegistrationMail(registration_data.email);

    // logger.info(sent.accepted);
    // logger.info(sent.response);

    let emailResponse = sent.response;
    let emailSuccessResponse = "250";

    if (
      sent.accepted[0] === email &&
      emailResponse.substring(0, 3) === emailSuccessResponse
    ) {
      return res.status(200).json({
        status: "success",
        message: "Use signup successfully",
      });
    }
  } catch (error) {
    // logger.error(error);

    return res.status(400).json({
      status: "fail",
      message: " Inserted data already exists or is not correct",
      error,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [results] = await loginModel(email);

    // logger.info(results);

    if (results.length === 0) {
      return res.status(401).json({
        status: "fail",
        message: "email does not found, please register with your email",
      });
    }

    if (!results || !(await bcrypt.compare(password, results[0].password))) {
      return res.status(401).json({
        status: "fail",
        message: "Password is incorrect: please enter correct password",
      });
    } else {
      const id = results[0].id;
      const payload = {
        id,
        email,
      };

      const token = generateToken(payload);

      // logger.info("the token has been generated " + token);

      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ), //converted into milli sec
        httpOnly: true,
      };

      res.cookie("userRegistered", token, cookieOptions);
      res.set("Authorization", `bearer ${token}`);
      res.set("Access-Control-Expose-Headers", "Authorization");

      return res.status(200).json({
        token,
        status: "success",
        message: "User has been logged in",
      });
    }
  } catch (error) {
    // logger.error(error);

    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getPasswordLink = async (req, res) => {
  const { email } = req.body;
  try {
    const [results] = await loginModel(email); // getting email from db

    // logger.info("results[0]", results[0]);

    if (results.length === 0) {
      return res.status(401).json({
        status: "fail",
        message: "email does not found, please register with your email",
      });
    } else {
      const payload = {
        email,
      };

      const token = generateToken(payload);

      const sent = await sendMail.resetPasswordMail(email, token);

      // logger.info(sent.accepted);
      // logger.info(sent.response);

      let emailResponse = sent.response;
      let emailSuccessResponse = "250";

      if (
        sent.accepted[0] === email &&
        emailResponse.substring(0, 3) === emailSuccessResponse
      ) {
        return res.status(200).json({
          status: "success",
          message: "password reset link sent successfully",
        });
      }
    }
  } catch (error) {
    // logger.error(error);

    return res.status(400).json({ status: "fail", message: error });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const secretKey = process.env.secretKey;

    const decryptedData = await decryptedPayload(token);

    // logger.info("decrypted data", decryptedData);
    // logger.info("decryted email", decryptedData.email);

    const [results] = await loginModel(decryptedData.email);

    // logger.info(results);

    if (results.length === 0) {
      return res.status(401).json({
        status: "fail",
        message: "email does not found, please register with your email",
      });
    }

    // logger.info("db email", results[0].email);

    jwt.verify(token, secretKey, async err => {
      if (!err) {
        if (results[0].email === decryptedData.email) {
          const [rows] = await updatePassword(results[0].email, password);

          // logger.info(rows);

          if (rows.affectedRows === 1) {
            return res.status(200).json({
              status: "success",
              message: "token is valid and password is updated",
              decryptedData,
            });
          }
        }
      }
    });
  } catch (error) {
    // logger.error(error);

    return res.status(400).json({
      status: "fail",
      message: "Your link has been expired",
      error,
    });
  }
};

const userProfile = async (req, res) => {
  const secretKey = process.env.secretKey;
  const token = req.token;

  try {
    const decryptedData = await decryptedPayload(token);

    // logger.info(decryptedData);

    jwt.verify(token, secretKey, err => {
      if (!err) {
        return res.status(200).json({
          status: "success",
          message: "token is valid",
          decryptedData,
        });
      }
    });
  } catch (error) {
    // logger.error(error);

    res.status(200).json({ status: "fail", message: "invalid token" });
  }
};

const logout = (req, res) => {
  res.cookie("userRegistered", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });

  return res.status(200).json({
    status: "success",
    message: "logged out succesfully",
  });
};
module.exports = {
  signup,
  login,
  userProfile,
  logout,
  getPasswordLink,
  resetPassword,
};
