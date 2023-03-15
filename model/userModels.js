const bcrypt = require("bcrypt");
const connection = require("../config/db");

exports.signupModel = async registration_data => {
  const { email, password, cnic } = registration_data;

  registration_data.password = await bcrypt.hash(password, 13);

  const data = [email, registration_data.password, cnic];

  const insert_query = "INSERT into users (email,password,cnic) values(?,?,?)";

  return await connection.promise().query(
    insert_query, //2. saving in database
    data
  );
};

exports.loginModel = async email => {
  return connection
    .promise()
    .query("SELECT * FROM users WHERE email = ?", [email]);
};
