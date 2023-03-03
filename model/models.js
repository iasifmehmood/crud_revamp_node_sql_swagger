const bcrypt = require("bcrypt");
const connection = require("../config/db");
const validator = require("email-validator");
const logger = require("../logger");
const email_schema = require("../middlewares/passwordValidation");

exports.addModel = async registration_data => {
  const { email, name, cnic, designation, contact, plain_password } =
    registration_data;

  registration_data.protected_password = await bcrypt.hash(plain_password, 13);

  const data = [
    email,
    plain_password,
    registration_data.protected_password,
    name,
    cnic,
    designation,
    contact,
  ];

  const insert_query =
    "INSERT into crud_table (email,plain_password,protected_password,name,cnic,designation,contact) values(?,?,?,?,?,?,?)";

  if (validator.validate(email) && email_schema.validate(plain_password)) {
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
  const viewAllData = "select * from crud_table";
  return connection.promise().query(viewAllData);
};

exports.getModelbyId = async registration_id => {
  const viewAllDataById = "select * from crud_table WHERE id=?";
  return connection.promise().query(viewAllDataById, [registration_id]);
};

exports.deleteModel = async registration_id => {
  const deleteData = "DELETE FROM crud_table WHERE id=?";
  return connection.promise().query(deleteData, [registration_id]);
};

exports.updateModel = async registration_data => {
  const user = registration_data.body;
  const { id } = registration_data.params;
  const { email, name, cnic, designation, contact, plain_password } =
    registration_data.body;
  registration_data.protected_password = await bcrypt.hash(plain_password, 13);

  const query = `email = '${email}',plain_password = '${plain_password}',protected_password = '${registration_data.protected_password}',
  name = '${name}',cnic = '${cnic}',designation = '${designation}',contact = '${contact}'`;

  const updateData = `UPDATE crud_table SET ${query} where id=` + id;

  if (validator.validate(email) && email_schema.validate(plain_password)) {
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
