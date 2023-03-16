const nodemailer = require("nodemailer");
const logger = require("../logger");
const dotenv = require("dotenv");
dotenv.config();
const { SMTP_MAIL, SMTP_PASSWORD } = process.env;
const resetEmail = async (email, token) => {
  console.log("resetemail");
  const msg = `<a href="http://localhost:4000/reset">Reset Link</a>
  `;

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
      subject: `Reset Password Link`,
      html: `Dear <b>${email}, here is your reset code ${token}</b> ${msg} `,
    };

    await transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        logger.error(error);
      } else {
        logger.info("mail send successfully", info.response);
      }
    });
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports = resetEmail;
