const logger = require("../logger");
const {
  addModel,
  getModel,
  getModelbyId,
  deleteModel,
  updateModel,
  loginVerification,
} = require("../model/models");
const sendMail = require("./sendMailController");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

/*************************Add data************** */

const addData = async (req, res) => {
  try {
    const registration_data = req.body;
    const [rows] = await addModel(registration_data);
    // sendMail(registration_data.email, registration_data.name);
    logger.info(rows);
    res.status(200).json({
      status: "success (try)",
      message: "Record Inserted successfully",
    });
  } catch (err) {
    logger.error(err);
    res.status(400).json({
      status: "fail (catch)",
      message: err.message + " Inserted data is not correct or already exists",
    });
  }
};

/************************Read Data***************** */

const viewData = async (req, res) => {
  try {
    const registration_data = req.body;
    const [rows] = await getModel(registration_data);
    res.status(200).json({ rows }); // show in swagger
    logger.info("Data view successfuly");
  } catch (err) {
    logger.error(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

/*******************Read by Id************************/

const viewDataById = async (req, res) => {
  try {
    const registration_id = req.params.id;
    const [rows] = await getModelbyId(registration_id);
    logger.info("data viewed by ID succesfully");
    logger.info(rows);
    res.status(200).json({ rows }); // show in swagger
    logger.info("data viewed by id");
  } catch (err) {
    logger.error(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

/*******************Delete Data******************** */

const deleteData = async (req, res) => {
  try {
    const registration_id = req.params.id;
    const [rows] = await deleteModel(registration_id);
    logger.info("data delete by ID succesfully");
    logger.info(rows);
    res.status(200).json({ rows }); // show in swagger
    logger.info("data deleted successfuly");
  } catch (err) {
    logger.error(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

/********************Update Data************************** */

const updateData = async (req, res) => {
  try {
    const registration_data = req;
    const [rows] = await updateModel(registration_data);
    logger.info(res.status(200).json({ rows }));
    logger.info("Data is updated successfully");
  } catch (err) {
    logger.error(err);
    res.status(400).json({
      status: "fail (catch)",
      message: err.message + " Inserted data is not correct",
    });
  }
};
const connection = require("../config/db");
const { query } = require("../config/db");

const loginData = async (req, res) => {
  const secretKey = process.env.secretKey;
  let user_data = {
    email: req.body.email,
    password: req.body.password,
  };
  jwt.sign({ user_data }, secretKey, { expiresIn: "300s" }, (error, token) => {
    if (error) {
      logger.info("error happened while generating token", error);
    } else {
      res.json({ token });
    }
  });
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

module.exports = {
  viewData,
  viewDataById,
  addData,
  deleteData,
  updateData,
  loginData,
  userProfile,
};
