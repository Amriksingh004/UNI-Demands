// utils/sendOrderConfirmationEmail.js
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

export const sendOrderConfirmationEmail = async (toEmail, orderDetails) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: toEmail,
    subject: `Order Confirmation - Order #${orderDetails.orderId}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Your order <strong>#${orderDetails.orderId}</strong> has been placed successfully.</p>
      <p><strong>Total Paid:</strong> $${orderDetails.orderTotal}</p>
      <p>We’ll notify you when it ships. If you have questions, reply to this email.</p>
      <br/>
      <em>- Avinash's Shop</em>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${toEmail}`);
  } catch (err) {
    console.error('❌ Failed to send confirmation email:', err);
  }
};
