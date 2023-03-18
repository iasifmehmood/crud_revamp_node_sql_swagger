const nodemailer = require("nodemailer");
const logger = require("../logger");
const dotenv = require("dotenv");
dotenv.config();
const { SMTP_MAIL, SMTP_PASSWORD } = process.env;

const resetEmail = (email, token) => {
  logger.info("reset email starting here");
  const msg = `<a href="http://localhost:4000/reset">Reset Link</a>
  `;

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: SMTP_MAIL,
      pass: SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: SMTP_MAIL,
    to: email,
    subject: `Reset Password Link`,
    html: `Dear <b>${email}, here is your reset code ${token}</b> ${msg} `,
  };

  return new Promise(function (resolve, reject) {
    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
        logger.error(error);
        // return false;
      } else {
        resolve(info);
        // logger.info("info.accepted", info.accepted);

        // logger.info("info.accepted", info);
        return true;
      }
    });
  });
};

module.exports = resetEmail;

// module.exports.sendMail = function(mailOptions) {
//   var transporter = ....;
//   return new Promise(function(resolve, reject) {
//     transporter.sendMail(mailOptions, function(error, info) {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(info);
//       }
//     });
//   });
// };

// const nodemailer = require("nodemailer");
// const logger = require("../logger");
// const dotenv = require("dotenv");
// dotenv.config();
// const { SMTP_MAIL, SMTP_PASSWORD } = process.env;

// const resetEmail = async (email, token) => {
//   logger.info("resetemail");
//   const msg = `<a href="http://localhost:4000/reset">Reset Link</a>
//   `;

//   try {
//     const transport = await nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       requireTLS: true,
//       auth: {
//         user: SMTP_MAIL,
//         pass: SMTP_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: SMTP_MAIL,
//       to: email,
//       subject: `Reset Password Link`,
//       html: `Dear <b>${email}, here is your reset code ${token}</b> ${msg} `,
//     };

//     let sent = await transport.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         logger.error(error);
//       } else {
//         logger.info("mail send successfully", info.response);
//         // logger.info("mail send successfully result", info);
//         logger.info("info.accepted", info.accepted);
//         logger.info("info.accepted", info);
//         return info;
//       }
//     });
//     logger.info("sentttttt", sent);
//     return sent;
//   } catch (error) {
//     logger.error(error.message);
//     return error;
//   }
// };

// module.exports = resetEmail;
