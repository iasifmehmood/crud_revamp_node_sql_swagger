const express = require("express");
const controller = require("../controller/userControllers.js");
const {
  logInvalidationCheck,
} = require("../middleware/logInValidationCheck.js");
const { verifyToken } = require("../middleware/verifyToken.js");
const {
  signUpvalidationCheck,
} = require("../middleware/signUpvalidationCheck.js");

const router = express.Router();

router.post("/signup", signUpvalidationCheck, controller.signup);
router.post("/login", logInvalidationCheck, controller.login);
router.post("/profile", verifyToken, controller.userProfile);
router.get("/logout", controller.logout);

module.exports = router;
