import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    // host: "tradeshop-mern.herokuapp.com",
    service: "hotmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // send mail with defined transport object
  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
