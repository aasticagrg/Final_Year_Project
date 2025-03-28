import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import TextField from "../components/TextField";
import { baseUrl } from "../constants";
import toast from "react-hot-toast";
import "./style.css"; 

const RegisterPage = () => {
    const navigate = useNavigate();
    const [registerForm, setRegisterForm] = useState({
        name: "",
        email: "",
        phone_no: "",
        user_address: "",
        password: ""
    });

    const onRegister = async (e) => {
        try {
            e.preventDefault();
    
            const formData = new FormData();
            formData.append("name", registerForm.name);
            formData.append("email", registerForm.email);
            formData.append("phone_no", registerForm.phone_no);
            formData.append("user_address", registerForm.user_address);
            formData.append("password", registerForm.password);
    
            const response = await fetch(baseUrl + "auth/register.php", {
                body: formData,
                method: "POST",
            });
            
            const data = await response.json();
            // console.log(text); // Log the raw response text
            
            
                // const data = JSON.parse(text);
                if (data.success) {
                    toast.success(data.message);
                    navigate("/Login");
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                // console.error("Failed to parse JSON:", error);
                toast.error("Invalid response format");
            }
            
    };
    

    return (
        <div className="register-container">
            {/* Left Side: Background Image */}
            <div className="image-container">
                <img src="/assets/auth.jpg" alt="Background" />
                <div className="image-text">
                    Create Your Account <br /> To Find the Perfect Rental.
                </div>
            </div>

            {/* Right Side: Form Section */}
            <div className="form-container">
                <h2>Create an account</h2>
                <form onSubmit={onRegister}>
                    <TextField className="custom-textfield" label="Full Name" hint="Enter your full name" type="text" 
                        value={registerForm.name} 
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} 
                        required
                    />
                    <TextField className="custom-textfield" label="Email" hint="Enter your email" type="email" 
                        value={registerForm.email} 
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} 
                        required
                    />
                    <TextField className="custom-textfield" label="Contact Number" hint="Enter your contact number" type="tel" 
                        value={registerForm.phone_no} 
                        onChange={(e) => setRegisterForm({ ...registerForm, phone_no: e.target.value })} 
                        required
                    />
                    <TextField className="custom-textfield" label="Address" hint="Enter your address" type="text" 
                        value={registerForm.user_address} 
                        onChange={(e) => setRegisterForm({ ...registerForm, user_address: e.target.value })} 
                        required
                    />
                    <TextField className="custom-textfield" label="Password" hint="Enter your password" type="password" 
                        value={registerForm.password} 
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} 
                        required
                    />
                    <Button className="custom-button" label="Register" type="submit" />
                </form>
                <span style={{
                    fontSize: "14px",
                    fontWeight: "normal"

                }}>{"Already have an account? "}
                    <Link to={"/Login"}>

                        <span style={{
                            color: "blue",
                            textDecoration: "underline",
                            cursor: "pointer"
                        }}>{"Login"}</span>
                    </Link>
                </span>
            </div>
        </div>
    );
};

export default RegisterPage;