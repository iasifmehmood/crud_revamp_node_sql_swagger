const bcrypt = require("bcrypt");
const connection = require("../config/db");

/*
@Signup_Model:
    Description:                      will run insert query and return inserted values 
*/

exports.insertSignUpData = async registration_data => {
  const { email, password, cnic } = registration_data;

  registration_data.password = await bcrypt.hash(password, 13);

  const data = [email, registration_data.password, cnic];

  const insert_query = "INSERT into users (email,password,cnic) values(?,?,?)";

  return await connection.promise().query(
    insert_query, //2. saving in database
    data
  );
};

/*
@Login_Model:
    Description:                      will run select query and return email 
*/

exports.getEmailFromDb = async email => {
  return connection
    .promise()
    .query("SELECT * FROM users WHERE email = ?", [email]);
};

/*
@Update_Password:
    Description:                      will run update query and return updated data 
*/

exports.updatePassword = async (email, password) => {
  password = await bcrypt.hash(password, 13);

  const updateData = "UPDATE users SET password=? WHERE email=?";

  return connection.promise().query(
    updateData,
    [password, email] //2. saving in database
  );
};
