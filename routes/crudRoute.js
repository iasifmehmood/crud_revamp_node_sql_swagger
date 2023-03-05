const express = require("express");
const controller = require("../controller/crudControllers.js");
const { verifyToken } = require("../middlewares/verifyToken.js");

const router = express.Router();

router.get("/user/view/", controller.viewData);
router.get("/user/view/:id", controller.viewDataById);
router.post("/user/add", controller.addData);
router.delete("/user/view/:id", controller.deleteData);
router.put("/user/view/:id", controller.updateData);
router.post("/login", controller.loginData);
router.post("/profile", verifyToken, controller.userProfile);
router.get("/logout", controller.logout);

module.exports = router;
