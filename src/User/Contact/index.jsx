import React, { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { baseUrl } from "../../constants";
import './style.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append("full_name", formData.full_name);
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone || "");
    formDataObj.append("message", formData.message);

    try {
      const response = await fetch(baseUrl + "contact.php", {
        method: "POST",
        body: formDataObj,
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message || "Message sent successfully!");
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        toast.error(result.message || "An error occurred");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <>
      
      <Navbar />
      <div className="contact-container">
        <div className="contact-image">
          <img 
            src="\assets\contact.jpg" 
            alt="Colorful boats" 
            className="boats-background" 
          />
        </div>
        <div className="contact-content">
          <div className="contact-text">
            <h2>We are here to help!</h2>
            <p>
              Let us know how we can best serve you. Use the contact form to email 
              us or select from the topics below that best fit your needs. It's 
              an honor to support you in your journey toward better living.
            </p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number (optional)"
              value={formData.phone}
              onChange={handleChange}
              pattern="\d{10}"
              title="Please enter a 10-digit phone number"
            />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit" className="send-message-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;