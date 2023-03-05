const express = require("express");
const controller = require("../controller/userControllers.js");
const { verifyToken } = require("../middleware/verifyToken.js");

const router = express.Router();

router.post("/adduser", controller.signup);

module.exports = router;
