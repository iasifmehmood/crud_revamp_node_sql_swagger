const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "jake0@ethereal.email",
      pass: "42ejsjfSfTfWD5KsbV",
    },
  });

  const email = req.body.email;
  const name = req.body.name;
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"admin 👻" <administrator@softoo.co>', // sender address
    to: `${email}`, // list of receivers
    subject: `Welcome to our Company Mr. ${name}`, // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendMail;
