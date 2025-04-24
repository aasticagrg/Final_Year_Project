import { useState } from "react";
import toast from "react-hot-toast";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { baseUrl } from "../../constants";
import "./style.css"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }

    try {
      const response = await fetch(baseUrl + "forgotPassword.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Send email in the body
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Password reset code sent to your email");
        navigate("/components/VerifyCode"); // Redirect to reset-password page
      } else {
        toast.error(data.message);
      }

      setMessage(data.message);
    } catch (error) {
      toast.error("An error occurred, please try again later.");
      setMessage("An error occurred, please try again later.");
      console.error("Error sending reset code:", error); // Additional error logging for debugging
    }
  };

  return (
    <div className="auth-container">
      <div className="forgot-password-page">
        <div className="forgot-password-box">
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              label="Email"
              hint="Enter your email to receive the reset code"
              type="email"
            />
            <Button label="Send Reset Code" type="submit" />
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
