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
  try {
    const registration_data = req.body;
    const [results] = await signupModel(registration_data, res);
    if (results.affectedRows == 1) {
      res.status(200).json({
        status: "success",
        message: "record is added succesfully",
      });
      sendMail(registration_data.email);
    }
    logger.info(results);
  } catch (error) {
    logger.info("error");
  }
};

module.exports = {
  signup,
};
