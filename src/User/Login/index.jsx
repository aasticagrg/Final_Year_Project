import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
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
            formData.append("email", form.email);
            formData.append("password", form.password);
            formData.append("role", isVendor ? "vendor" : "user");

            const response = await fetch(baseUrl + "auth/login.php", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                // Ensure the role matches the selected tab
                if ((isVendor && data.role !== "vendor") || (!isVendor && data.role !== "user")) {
                    toast.error("Invalid email or password for the selected role.");
                    return;
                }

                // Store relevant data in localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);

                if (data.role === "vendor" && data.vendor) {
                    localStorage.setItem("vendor", JSON.stringify(data.vendor));
                }

                toast.success(data.message);

                // Navigate to the respective dashboard
                navigate(data.role === "vendor" ? "/Vendor/Home" : "/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.error(error);
        }
    };

    return (
        <div className="auth-container">
            <div className="login-page">
                <div className="login-overlay">
                    <div className="login-box">
                        <h2 className="login-heading">Log In to your account</h2>
                        <div className="login-tabs">
                            <div
                                className={`login-tab ${!isVendor ? "active" : ""}`}
                                onClick={() => setIsVendor(false)}
                            >
                                User
                            </div>
                            <div
                                className={`login-tab ${isVendor ? "active" : ""}`}
                                onClick={() => setIsVendor(true)}
                            >
                                Vendor
                            </div>
                        </div>
                        <form className="login-form" onSubmit={onLogin}>
                            <TextField
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                                label="Email"
                                hint="Enter your email"
                                type="email"
                            />
                            <TextField
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                label="Password"
                                hint="Enter your password"
                                type="password"
                            />
                            <Button label="Login" type="submit" />
                        </form>
                        <span className="register-text">
                            Don't have an account?{" "}
                            <Link to={isVendor ? "/Vendor/VendorRegister" : "/User/Register"} className="register-link">
                                {isVendor ? "Register as Vendor" : "Register"}
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;