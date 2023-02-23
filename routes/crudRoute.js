const express = require("express");
const controller = require("../controller/crudControllers.js");

const router = express.Router();

router.get("/user/view/", controller.viewData);
router.get("/user/view/:id", controller.viewDataById);
router.post("/user/add", controller.addData);
router.delete("/user/view/:id", controller.deleteData);
router.put("/user/view/:id", controller.updateData);

module.exports = router;
