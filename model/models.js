const bcrypt = require("bcrypt");
const connection = require("../config/db");
const logger = require("../logger");
const password_schema = require("../middlewares/passwordValidation");
const email_validator = require("../middlewares/emailValidation");

exports.addModel = async registration_data => {
  const { email, password, cnic } = registration_data;

  registration_data.password = await bcrypt.hash(password, 13);

  const data = [email, registration_data.password, cnic];

  const insert_query = "INSERT into users (email,password,cnic) values(?,?,?)";

  if (email_validator.validate(email) && password_schema.validate(password)) {
    return connection.promise().query(
      insert_query, //2. saving in database
      data
    );
  } else {
    logger.info(
      "Email is invalid/Passwword: password must have min 8 character (Uppercase,Lowercase and digits only) "
    );
  }
};

exports.getModel = async () => {
  const viewAllData = "select * from users";
  return connection.promise().query(viewAllData);
};

exports.getModelbyId = async registration_id => {
  const viewAllDataById = "select * from users WHERE id=?";
  return connection.promise().query(viewAllDataById, [registration_id]);
};

exports.deleteModel = async registration_id => {
  const deleteData = "DELETE FROM users WHERE id=?";
  return connection.promise().query(deleteData, [registration_id]);
};

exports.updateModel = async registration_data => {
  const user = registration_data.body;
  const { id } = registration_data.params;
  const { email, password, cnic } = registration_data.body;
  registration_data.password = await bcrypt.hash(password, 13);

  const query = `email = '${email}',password = '${registration_data.password}',cnic = '${cnic}'`;

  const updateData = `UPDATE users SET ${query} where id=` + id;

  if (email_validator.validate(email) && password_schema.validate(password)) {
    return connection.promise().query(
      updateData, //2. saving in database
      [user]
    );
  } else {
    logger.info(
      "Email is invalid/Passwword: password must have min 8 character (Uppercase,Lowercase and digits only) "
    );
  }
};

// exports.loginVerification = async (email, password, res) => {
//   return connection
//     .promise()
//     .query(
//       "SELECT * FROM users WHERE email = ?",
//       [email],
//       function (error, results, fields) {
//         if (error) {
//           console.log("error ocurred", error);
//           res.send({
//             code: 400,
//             failed: "error ocurred",
//           });
//         } else {
//           console.log("The solution is: ", results);
//           if (results.length > 0) {
//             if (results[0].password == password) {
//               res.send({
//                 code: 200,
//                 success: "login sucessfull",
//               });
//             } else {
//               res.send({
//                 code: 204,
//                 success: "Email and password does not match",
//               });
//             }
//           } else {
//             res.send({
//               code: 204,
//               success: "Email does not exits",
//             });
//           }
//         }
//       }
//     );
// };
