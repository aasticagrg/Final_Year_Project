import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { baseUrl } from "../../constants";
import "./style.css"; 
const ResetPassword = () => {
  const { code, email } = useParams(); // Get code and email from URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch(baseUrl + "resetPassword.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, email, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Password reset successfully!");
        setMessage(data.message);
        setTimeout(() => {
          navigate("/User/login"); // Redirect to login page
        });
      } else {
        toast.error(data.message);
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An error occurred. Please try again later.");
      setMessage("An error occurred. Please try again later.");
    }
  };
  console.log("Email:", email);
console.log("Code:", code);
console.log("New Password:", newPassword);


  return (
    <div className="auth-container">
      <div className="reset-password-page">
        <div className="reset-password-box">
          <h2>Reset Your Password</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              label="New Password"
              hint="Enter your new password"
              type="password"
            />
            <Button label="Reset Password" type="submit" />
          </form>
          {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
