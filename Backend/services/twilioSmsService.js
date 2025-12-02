import twilio from 'twilio'
import dotenv from 'dotenv';

dotenv.config();


// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createMessage(orderId, orderTotal, phoneNumber) {
  try {
    const message = await client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: "+91"+phoneNumber,
        body: `Your order #${orderId} has been confirmed. Total: ₹${orderTotal}`,
    });
    console.log(message.body);
  } catch (error) {
    console.error(`Error sending SMS to ${phoneNumber}:`, error);
  }
}

export default createMessage;