const bcrypt = require("bcrypt");
const connection = require("../config/db");
const validator = require("email-validator");
const logger = require("../logger");
const passwordValidator = require("password-validator");
const schema = new passwordValidator();
schema
  .is()
  .min(8) // Minimum length 8
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(); // Must have digits

exports.addModel = async values => {
  const { email, name, cnic, designation, contact, plain_password } = values;

  values.protected_password = await bcrypt.hash(plain_password, 13);

  const data = [
    email,
    plain_password,
    values.protected_password,
    name,
    cnic,
    designation,
    contact,
  ];

  const insert_query =
    "INSERT into crud_table (email,plain_password,protected_password,name,cnic,designation,contact) values(?,?,?,?,?,?,?)";

  const find_email = "SELECT COUNT(*) AS count FROM crud_table WHERE email = ?";

  connection.query(find_email, email, (error, results) => {
    if (error) {
      logger.info(error);
      return;
    }

    const count = results[0].count;

    if (count > 0) {
      logger.info("Email already exists in the database");
      return;
    } else {
      if (validator.validate(email) && schema.validate(plain_password)) {
        return connection.promise().query(
          insert_query, //2. saving in database
          data
        );
      } else {
        logger.info(
          "Email is invalid/Passwword: password must have min 8 character (Uppercase,Lowercase and digits only) "
        );
      }
    }
  });
};

exports.getModel = async () => {
  const viewAllData = "select * from crud_table";
  return connection.promise().query(viewAllData);
};

exports.getModelbyId = async req => {
  const id = req;
  const viewAllDataById = "select * from crud_table WHERE id=?";
  return connection.promise().query(viewAllDataById, [id]);
};

exports.deleteModel = async req => {
  const id = req;
  const deleteData = "DELETE FROM crud_table WHERE id=?";
  return connection.promise().query(deleteData, [id]);
};

exports.updateModel = async req => {
  const user = req.body;
  const { id } = req.params;
  const { email, name, cnic, designation, contact, plain_password } = req.body;
  req.protected_password = await bcrypt.hash(plain_password, 13);

  const query = `email = '${email}',plain_password = '${plain_password}',protected_password = '${req.protected_password}',
  name = '${name}',cnic = '${cnic}',designation = '${designation}',contact = '${contact}'`;
  const updateData = `UPDATE crud_table SET ${query} where id=` + id;

  if (validator.validate(email) && schema.validate(plain_password)) {
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
