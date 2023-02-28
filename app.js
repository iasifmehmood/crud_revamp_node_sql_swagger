const express = require("express"); //express package initiated
const app = express(); // express instance has been created and will be access by app variable
const bodyParser = require("body-parser");
const cors = require("cors");
const crud_routes = require("./routes/crudRoute.js");

/*********************Authen**************************** */
const dotenv = require("dotenv");
dotenv.config();
app.use(cors());

/**********************POST API ************************** */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/***********************************Swagger API Testing******************* */

const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/", crud_routes);

module.exports = app;
