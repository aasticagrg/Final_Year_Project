import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { baseUrl } from "../../constants";
import "./style.css";

const VerifyResetCode = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !code) {
      toast.error("Email and code are required.");
      return;
    }

    try {
      const res = await fetch(baseUrl + "verifyCode.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Code verified. Please reset your password.");
        navigate(`/components/ResetPassword/${email}/${code}`);

      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="auth-container">
      <div className="verify-box">
        <h2>Verify Reset Code</h2>
        <form onSubmit={handleSubmit}>
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField label="Reset Code" value={code} onChange={(e) => setCode(e.target.value)} required />
          <Button label="Verify Code" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default VerifyResetCode;
