import React, { useState } from "react";
import Header from "../../components/Header";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic form validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("Your message has been sent successfully!");

    // (Optional) Add backend request with axios
    // axios.post("/api/contact", form);
  };

  return (
    <div style={styles.container}>
      <Header />

      <h1 style={styles.title}>Contact Us</h1>

      <form style={styles.form} onSubmit={handleSubmit}>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <textarea
          name="message"
          placeholder="Write your message here..."
          value={form.message}
          onChange={handleChange}
          style={styles.textarea}
        ></textarea>

        <button type="submit" style={styles.btn}>Send Message</button>
      </form>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  title: { textAlign: "center", marginTop: "20px", fontSize: "28px" },
  form: {
    maxWidth: "500px",
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  textarea: {
    padding: "12px",
    height: "120px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  btn: {
    padding: "12px",
    fontSize: "18px",
    borderRadius: "6px",
    backgroundColor: "#0077ff",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },
  error: { color: "red", textAlign: "center" },
  success: { color: "green", textAlign: "center" }
};

export default Contact;
