const nodemailer = require("nodemailer");
const logger = require("../logger");
const dotenv = require("dotenv");
dotenv.config();
const { SMTP_MAIL, SMTP_PASSWORD } = process.env;

const sendMail = async (email, name) => {
  const msg = "Thanks for registering";
  try {
    const transport = await nodemailer.createTransport({
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
      subject: `Welcome to our Company Mr. ${name}`,
      html: `Dear <b>${name},</b> ${msg} `,
    };

    await transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        logger.info(error);
      } else {
        logger.info("mail send successfully", info.response);
      }
    });
  } catch (error) {
    logger.info(error.message);
  }
};

module.exports = sendMail;
