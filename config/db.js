const mysql2 = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql2.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect(error => {
  if (error) return console.log(error);
  console.log("db connection successfull");
});

module.exports = connection;
