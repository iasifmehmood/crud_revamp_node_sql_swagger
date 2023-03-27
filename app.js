const express = require("express"); //express package initiated
const app = express(); // express instance has been created and will be access by app variable
const bodyParser = require("body-parser");
const cors = require("cors");
const user_routes = require("./route/userRoutes.js");
// const { fileStorage, fileFilter } = require("./services/fileStorage.js");

const multer = require("multer");

/**********************POST API ************************** */
app.use(express.urlencoded({ extended: true }));
// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).single("file")
// );
app.use(express.json());

/*********************Authen**************************** */
const dotenv = require("dotenv");
dotenv.config();
app.use(cors());

/***********************************Swagger API Testing******************* */

const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/", user_routes);

module.exports = app;
