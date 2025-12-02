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
    // const mailOptions = {
    //   from: process.env.SENDER_EMAIL, // Your verified sender email
    //   to: toEmail,
    //   subject: `Order Confirmation - #${orderDetails.orderId}`,
    //   html: `
    //     <h1>Thank you for your order!</h1>
    //     <p>Your order #${orderDetails.orderId} has been confirmed.</p>
    //     <p>Total: $${orderDetails.orderTotal}</p>
    //     <p>We will send another email when your order ships.</p>
    //   `,
    // };
const mailOptions = {
  from: process.env.SENDER_EMAIL,
  to: toEmail,
  subject: `Order Confirmation - Order #${orderDetails.orderId}`,
  html: `
    <h2>Thank you for your order!</h2>
    <p>Your order <strong>#${orderDetails.orderId}</strong> has been successfully placed.</p>
    <p>Total: <strong>$${orderDetails.orderTotal}</strong></p>
    <p>We will notify you when your order ships.</p>
    <br/>
    <em>This is an automated message from Avinash's Shop.</em>
  `
};

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Error sending email to ${toEmail}:`, error);
  }
};