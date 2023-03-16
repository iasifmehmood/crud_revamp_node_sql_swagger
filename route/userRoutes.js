const express = require("express");
const controller = require("../controller/userControllers.js");
const {
  logInvalidationCheck,
} = require("../middleware/logInValidationCheck.js");
const { verifyToken } = require("../middleware/verifyToken.js");
const {
  signUpvalidationCheck,
} = require("../middleware/signUpvalidationCheck.js");
const { resetEmailCheck } = require("../middleware/resetEmailCheck.js");
const { resetPasswordCheck } = require("../middleware/resetPasswordCheck.js");

const router = express.Router();

router.post("/signup", signUpvalidationCheck, controller.signup);
router.post("/login", logInvalidationCheck, controller.login);
router.post("/profile", verifyToken, controller.userProfile);
router.get("/logout", controller.logout);
router.post("/forget", resetEmailCheck, controller.getPasswordLink);
router.post("/reset", resetPasswordCheck, controller.resetPassword);

module.exports = router;
