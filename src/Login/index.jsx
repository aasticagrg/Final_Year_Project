import Button from "../components/Button";
import TextField from "../components/TextField";
import "./style.css";

const Login = () => {
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
                <div className="login-form">
                    <TextField
                        label="Email"
                        hint="eg: xyz@gmail.com"
                        type="email"
                        className="login-input"
                    />
                    <TextField
                        label="Password"
                        hint="Enter your password"
                        type="password"
                        className="login-input"
                    />
                    <Button
                        label="Log In"
                        onClick={() => {
                            // Handle Login
                        }}
                        className="login-button"
                    />
                    <div className="login-footer">
                        Don't have an account?{" "}
                        <a href="#" className="login-link">
                            Sign up
                        </a>
                        <br />
                        <a href="#" className="login-link">
                            Forgot Password?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
