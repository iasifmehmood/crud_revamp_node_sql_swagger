const bcrypt = require("bcrypt");
const connection = require("../config/db");

exports.addModel = async values => {
  const { email, name, cnic, designation, contact, plain_password } = values;

  /****************************Plain Password********************* */
  //   const plain_password = values.protected_password;

  /****************************Protected Password****************** */
  //   let protected_password = values.protected_password;
  // console.log(plain_password);
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
  // if (validator.validate(email))
  const insert_query =
    "INSERT into crud_table (email,plain_password,protected_password,name,cnic,designation,contact) values(?,?,?,?,?,?,?)";

  return connection.promise().query(
    insert_query, //2. saving in database
    data
  );
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

  /*********************Protected Updated Password********* */
  req.protected_password = await bcrypt.hash(plain_password, 13);

  const query = `email = '${email}',plain_password = '${plain_password}',protected_password = '${req.protected_password}',
  name = '${name}',cnic = '${cnic}',designation = '${designation}',contact = '${contact}'`;
  const updateData = `UPDATE crud_table SET ${query} where id=` + id;

  return connection.promise().query(
    updateData, //2. saving in database
    [user]
  );
};
