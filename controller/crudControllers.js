const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const connection = require("../config/db");
const logger = require("../logger");
const {
  addModel,
  getModel,
  getModelbyId,
  deleteModel,
  updateModel,
} = require("../model/models");
dotenv.config();

/*************************Add data************** */

const addData = async (req, res) => {
  try {
    const [rows] = await addModel(req.body);
    logger.info(rows);
    res.json({
      status: "success (try)",
      message: "Record Inserted successfully",
    });
  } catch (err) {
    logger.error(err);
    res.status(400).json({
      status: "fail (catch)",
      message: err.message + " Inserted data is not correct",
    });
  }
};

/************************Read Data***************** */

const viewData = async (req, res) => {
  try {
    const [rows] = await getModel(req.body);
    res.json({ rows }); // show in swagger
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
    const [rows] = await getModelbyId(req.params.id);
    logger.info("data viewed by ID succesfully");
    logger.info(rows);
    res.json({ rows }); // show in swagger
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
    const [rows] = await deleteModel(req.params.id);
    logger.info("data delete by ID succesfully");
    logger.info(rows);
    res.json({ rows }); // show in swagger
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
    const [rows] = await updateModel(req);
    logger.info(res.json({ rows }));
    logger.info("Data is updated successfully");
  } catch (err) {
    logger.error(err);
    res.status(400).json({
      status: "fail (catch)",
      message: err.message + " Inserted data is not correct",
    });
  }
};

module.exports = {
  viewData,
  viewDataById,
  addData,
  deleteData,
  updateData,
};
