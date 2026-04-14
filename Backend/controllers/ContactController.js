import { sendEmail } from "../services/emailService.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log("Contact form received:", { name, email, message });

    // Validate required fields
    if (!name || !email || !message) {
      console.log("Validation failed: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Send email to admin inbox
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    console.log("Sending to admin email:", adminEmail);

    const subject = `New Contact Message from ${name}`;
    const html = `
      <h2>New Contact Message</h2>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr/>
      <p><em>Reply to: ${email}</em></p>
    `;

    await sendEmail(adminEmail, subject, html);
    console.log("Admin email sent successfully");

    // Optionally send a confirmation email to the user
    const userSubject = "We received your message";
    const userHtml = `
      <h2>Thank you for contacting us!</h2>
      <p>Hi ${name},</p>
      <p>We have received your message and will get back to you shortly.</p>
      <p>Your message: <br/>${message.replace(/\n/g, '<br>')}</p>
      <br/>
      <p>Best regards,<br/>Support Team</p>
    `;

    await sendEmail(email, userSubject, userHtml);
    console.log("User confirmation email sent successfully");

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Error sending contact message:", err);
    return res.status(500).json({ message: "Failed to send message", error: err.message });
  }
};
