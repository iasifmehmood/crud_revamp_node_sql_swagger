const nodemailer = require("nodemailer");
const logger = require("../logger");
const dotenv = require("dotenv");
dotenv.config();
const { SMTP_MAIL, SMTP_PASSWORD } = process.env;

exports.sendRegistrationMail = email => {
  const msg = "Thanks for registering";

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
    subject: `Welcome to our Company Mr. ${email}`,
    html: `Dear <b>${email},</b> ${msg} `,
  };

  return new Promise(function (resolve, reject) {
    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);

        // logger.error(error);

        return error;
      } else {
        resolve(info);
        // logger.info("info.accepted", info.accepted);
        // logger.info("info.accepted", info);

        return info;
      }
    });
  });
};

exports.resetPasswordMail = (email, token) => {
  // logger.info("reset email starting here");

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
    html: `Dear <b>${email}, here is your reset code ${token} Kindly enter your code in this link</b> ${msg} `,
  };

  return new Promise(function (resolve, reject) {
    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);

        // logger.error(error);

        return error;
      } else {
        resolve(info);

        // logger.info("info.accepted", info.accepted);
        // logger.info("info.accepted", info);

        return info;
      }
    });
  });
};
