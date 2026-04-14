import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

// Verify SMTP connection at startup and log helpful info for debugging
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection failed:', error);
  } else {
    console.log('SMTP server is ready to take messages');
  }
});

// export const sendOrderConfirmationEmail = async (toEmail, orderDetails) => {
//   try {
//     const mailOptions = {
//       from: process.env.SENDER_EMAIL, // Your verified sender email
//       to: toEmail,
//       subject: `Order Confirmation - #${orderDetails.orderId}`,
//       html: `
//         <h1>Thank you for your order!</h1>
//         <p>Your order #${orderDetails.orderId} has been confirmed.</p>
//         <p>Total: $${orderDetails.orderTotal}</p>
//         <p>We will send another email when your order ships.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Order confirmation email sent to ${toEmail}`);
//   } catch (error) {
//     console.error(`Error sending email to ${toEmail}:`, error);
//   }
// };


export const sendOrderConfirmationEmail = async (toEmail, orderDetails) => {
  try {
const mailOptions = {
  from: process.env.SENDER_EMAIL,
  to: toEmail,
  subject: `Order Confirmation - #${orderDetails.orderId}`,
  html: `
    <h1>Thank you for your order!</h1>
    <p>Your order #${orderDetails.orderId} has been confirmed.</p>
    <p>Total: $${orderDetails.orderTotal}</p>
    <p>We will send another email when your order ships.</p>
  `,
};

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Error sending email to ${toEmail}:`, error);
  }
};

export const sendEmail = async (toEmail, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: toEmail,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${toEmail} - subject: ${subject}`);
  } catch (error) {
    console.error(`Error sending email to ${toEmail}:`, error);
  }
};