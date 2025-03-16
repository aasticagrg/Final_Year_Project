import { baseUrl } from "../constants";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import TextField from "../components/TextField";
import "./style.css";

const LoginPage = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [isVendor, setIsVendor] = useState(false);
    const navigate = useNavigate();

    const onLogin = async (e) => {
        try {
            e.preventDefault();

            const formData = new FormData();
            // Use the email field name based on whether it's a vendor login or not
            if (isVendor) {
                formData.append("vendor_email", form.email);
            } else {
                formData.append("email", form.email);
            }
            formData.append("password", form.password);

            const response = await fetch(baseUrl + "auth/login.php", {
                body: formData,
                method: "POST"
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                
                // Store complete vendor information if this is a vendor login
                if (data.role === "vendor" && data.vendor) {
                    localStorage.setItem("vendor", JSON.stringify(data.vendor));
                    console.log("Vendor data stored in localStorage:", data.vendor);
                }
                
                toast.success(data.message);
                
                // Navigate based on role with fixed paths
                if (data.role === "vendor") {
                    navigate("/Vendor/Home"); 
                } else if (data.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };
    
    return (
        <div className="login-container">
            {/* Left Side: Image with Text */}
            <div className="login-image">
                <img
                    src="./assets/auth.jpg"
                    alt="Vacation Rental"
                    className="login-image"
                />
                <div className="login-image-text">
                    Lock In Your Perfect<br />Vacation Rental.
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="login-form-container">
                <h2 className="login-heading">Log In to your account</h2>
                <div className="login-tabs">
                    <div 
                        className={`login-tab ${!isVendor ? 'active' : ''}`}
                        onClick={() => setIsVendor(false)}
                    >
                        User
                    </div>
                    <div 
                        className={`login-tab ${isVendor ? 'active' : ''}`}
                        onClick={() => setIsVendor(true)}
                    >
                        Vendor
                    </div>
                </div>
                <div className="login-form">
                    <form onSubmit={onLogin}>
                        <TextField 
                            value={form.email} 
                            onChange={(e) => {
                                setForm({ ...form, email: e.target.value });
                            }} 
                            required={true} 
                            label={isVendor ? "Vendor Email" : "Email"} 
                            hint={isVendor ? "Enter your vendor email" : "Enter your email"} 
                            type={"email"} 
                        />
                        <TextField 
                            value={form.password}
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    password: e.target.value
                                });
                            }}
                            required={true} 
                            label={"Password"} 
                            hint={"Enter your password"} 
                            type={"password"} 
                        />
                        <Button label={isVendor ? "Login as Vendor" : "Login"} type={"submit"} />
                    </form>
                    <span style={{
                        fontSize: "14px",
                        fontWeight: "normal"
                    }}>{`Don't have an account? `}
                        <Link to={isVendor ? "/VendorRegister" : "/Register"}>
                            <span style={{
                                color: "blue",
                                textDecoration: "underline",
                                cursor: "pointer"
                            }}>{isVendor ? "Register as Vendor" : "Register"}</span>
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;