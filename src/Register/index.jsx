import Button from "../components/Button";
import TextField from "../components/TextField";
import "./style.css";

const Register = () => {
    return (
        <>
            <div className="register-container">
                {/* Left Side: Background Image */}
                <div className="image-container">
                    <img src="./assets/auth.jpg" alt="Background" />
                    <div className="image-text">
                        Create Your Account <br /> To Find the Perfect Rental.
                    </div>
                </div>

                {/* Right Side: Form Section */}
                <div className="form-container">
                    <h2>Create an account</h2>
                    <TextField className="custom-textfield" label={"Full Name"} hint={"Enter your full name"} type={"text"} />
                    <TextField className="custom-textfield" label={"Email"} hint={"Enter your email"} type={"email"} />
                    <TextField className="custom-textfield" label={"Contact Number"} hint={"Enter your contact number"} type={"tel"} />
                    <TextField className="custom-textfield" label={"Address"} hint={"Enter your address"} type={"text"} />
                    <TextField className="custom-textfield" label={"Password"} hint={"Enter your password"} type={"password"} />
                    <Button  label={"Register"} onClick={() => { }} />
                </div>
            </div>
        </>
    );
};

export default Register;
