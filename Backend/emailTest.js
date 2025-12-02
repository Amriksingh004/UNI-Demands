import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: process.env.SENDER_EMAIL,
  to: 'as8469004@gmail.com', // use a different email
  subject: 'Test Email',
  html: `<h3>This is a test email</h3><p>Testing if emails go through</p>`
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    return console.error('Error:', err.message);
  }
  console.log('Email sent!', info.response);
});
