const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const connection = require("../config/db");
const logger = require("../logger");
const {
  addModel,
  getModel,
  getModelbyId,
  deleteModel,
  updateModel,
} = require("../model/models");
// var validator = require("email-validator");
dotenv.config();

/*************************Add data************** */

const addData = async (req, res) => {
  try {
    const [rows] = await addModel(req.body);
    // if (rows.affectedRows === 1) {
    logger.info(rows);
    res.json({
      status: "success",
      message: "Record Inserted successfully",
    });
    // }
  } catch (err) {
    logger.error(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }

  // getModel(req, res);
  // const { email, name, cnic, designation, contact } = req.body;
  // /****************************Plain Password********************* */
  // const plain_password = req.body.protected_password;
  // /****************************Protected Password****************** */
  // let protected_password = req.body.protected_password;
  // const salt = await bcrypt.genSalt(10);
  // protected_password = await bcrypt.hash(protected_password, salt);
  // const data = [
  //   email,
  //   plain_password,
  //   protected_password,
  //   name,
  //   cnic,
  //   designation,
  //   contact,
  // ];
  // // if (validator.validate(email))
  // const insert_query =
  //   "INSERT into crud_table (email,plain_password,protected_password,name,cnic,designation,contact) values(?,?,?,?,?,?,?)";
  // try {
  //   await connection.query(
  //     insert_query, //2. saving in database
  //     data,
  //     function (err, result) {
  //       if (err) {
  //         logger.info(err);
  //         res.status(400);
  //       } else {
  //         logger.info(res.json({ result }));
  //         logger.info("data inserted successfully");
  //       }
  //     }
  //   );
  // } catch (err) {
  //   res.send(err);
  // }
};

/************************Read Data***************** */

const viewData = async (req, res) => {
  try {
    const [rows] = await getModel(req.body);
    // if (rows.affectedRows === 1) {
    logger.info(rows);
    logger.info(res.json({ rows })); // show in swagger
    res.json({
      status: "success",
      message: "Record Viewed successfully",
    });
    // }
  } catch (err) {
    logger.error(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
// const viewData = async (req, res) => {
//   const viewAllData = "select * from crud_table";
//   try {
//     await connection.query(viewAllData, (err, rows) => {
//       if (err) {
//         res.send(err);
//       } else {
//         logger.info(res.json({ rows }));
//         logger.info("Data read success");
//       }
//     });
//   } catch (err) {
//     res.send(err);
//   }
// };

/*******************Read by Id************************/

const viewDataById = async (req, res) => {
  try {
    const [rows] = await getModelbyId(req.params.id);
    // if (rows.affectedRows === 1) {
    logger.info("data viewed by ID succesfully");
    // logger.info(rows);
    logger.info(res.json({ rows })); // show in swagger

    // res.json({
    //   status: "success",
    //   message: "Record Viewed successfully",
    // });
    // }
  } catch (err) {
    logger.error(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// const viewDataById = async (req, res) => {
//   const id = req.params.id;
//   const viewAllDataById = "select * from crud_table WHERE id=?";
//   try {
//     await connection.query(viewAllDataById, [id], (err, rows) => {
//       if (err) {
//         res.send(err);
//       } else {
//         logger.info(res.json({ rows }));
//         logger.info("data viewed by ID succesfully");
//       }
//     });
//   } catch (err) {
//     res.send(err);
//   }
// };

/*******************Delete Data******************** */

const deleteData = async (req, res) => {
  try {
    const [rows] = await deleteModel(req.params.id);
    // if (rows.affectedRows === 1) {
    logger.info("data delete by ID succesfully");
    // logger.info(rows);
    logger.info(res.json({ rows })); // show in swagger

    // res.json({
    //   status: "success",
    //   message: "Record Viewed successfully",
    // });
    // }
  } catch (err) {
    logger.error(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// const deleteData = async (req, res) => {
//   const id = req.params.id;
//   const deleteData = "DELETE FROM crud_table WHERE id=?";
//   try {
//     await connection.query(deleteData, [id], (err, rows) => {
//       if (err) {
//         res.send(err);
//       } else {
//         logger.info(res.json({ rows }));
//         logger.info("data deleted sucessfully");
//       }
//     });
//   } catch (err) {
//     res.send(err);
//   }
// };

/********************Update Data************************** */

//issue
const updateData = async (req, res) => {
  try {
    const [rows] = await updateModel(req);
    // if (rows.affectedRows === 1) {
    logger.info(rows);
    res.json({
      status: "success",
      message: "Record updated successfully",
    });
    // }
  } catch (err) {
    logger.error(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// const updateData = async (req, res) => {
//   const user = req.body;
//   const { id } = req.params;
//   const { email, name, cnic, designation, contact } = req.body;

//   /********************Plain updated Password************ */
//   const plain_password = req.body.protected_password;

//   /*********************Protected Updated Password********* */
//   let protected_password = req.body.protected_password;
//   const salt = await bcrypt.genSalt(10);
//   protected_password = await bcrypt.hash(protected_password, salt);

//   const query = `email = '${email}',plain_password = '${plain_password}',protected_password = '${protected_password}',
//   name = '${name}',cnic = '${cnic}',designation = '${designation}',contact = '${contact}'`;
//   const updateData = `UPDATE crud_table SET ${query} where id=` + id;

//   try {
//     await connection.query(updateData, [user], (err, rows) => {
//       if (err) {
//         logger.info(res.send(err));
//       } else {
//         logger.info(res.send(rows));
//         logger.info("data updated successfully");
//       }
//     });
//   } catch (err) {
//     res.send(err);
//   }
// };

module.exports = {
  viewData,
  viewDataById,
  addData,
  deleteData,
  updateData,
};
