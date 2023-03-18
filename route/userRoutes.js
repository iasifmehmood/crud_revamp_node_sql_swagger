const express = require("express");
const controller = require("../controller/userControllers.js");
const validations = require("../middleware/validations.js");
const { verifyToken } = require("../middleware/verifyToken.js");

const router = express.Router();

router.post("/signup", validations.signUpvalidationCheck, controller.signup);
router.post("/login", validations.logInvalidationCheck, controller.login);
router.post("/profile", verifyToken, controller.userProfile);
router.get("/logout", controller.logout);
router.post("/forget", validations.resetEmailCheck, controller.getPasswordLink);
router.post("/reset", validations.resetPasswordCheck, controller.resetPassword);

module.exports = router;
