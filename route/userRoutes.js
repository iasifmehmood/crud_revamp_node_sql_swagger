const express = require("express");
const controller = require("../controller/userControllers.js");
const { verifyToken } = require("../middleware/verifyToken.js");

const router = express.Router();

router.post("/login", controller.login);
router.post("/profile", verifyToken, controller.userProfile);
router.get("/logout", controller.logout);

module.exports = router;
