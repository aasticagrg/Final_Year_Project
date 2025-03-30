import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import "./style.css"; 

const VendorRegisterPage = () => {
    const navigate = useNavigate();
    const [registerForm, setRegisterForm] = useState({
        vendor_name: "",
        vendor_email: "",
        contact_no: "",
        vendor_address: "", 
        password: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onRegister = async (e) => {
        try {
            e.preventDefault();
            
            if (!imageFile) {
                toast.error("Business certificate is required");
                return;
            }
    
            const formData = new FormData();
            formData.append("vendor_name", registerForm.vendor_name);
            formData.append("vendor_email", registerForm.vendor_email);
            formData.append("contact_no", registerForm.contact_no);
            formData.append("vendor_address", registerForm.vendor_address);
            formData.append("password", registerForm.password);
            formData.append("vendor_verification", imageFile);
    
            const response = await fetch(baseUrl + "auth/vendorRegister.php", {
                body: formData,
                method: "POST",
            });
            
            const data = await response.json();
            
            if (data.success) {
                toast.success(data.message);
                navigate("/User/Login");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Invalid response format");
        }
    };

    return (
        <div className="register-container">
            {/* Left Side: Background Image */}
            <div className="image-container">
                <img src="/assets/auth.jpg" alt="Background" />
                <div className="image-text">
                    Reach more renters or<br/> 
                    buyers by listing your<br/> 
                    property with us.
                </div>
            </div>

            {/* Right Side: Form Section */}
            <div className="form-container">
                <h2>Create an account</h2>
                <form onSubmit={onRegister}>
                    <div className="form-row">
                        <TextField 
                            className="custom-textfield"
                            label="Full name" 
                            hint="Enter your full name" 
                            type="text" 
                            value={registerForm.vendor_name} 
                            onChange={(e) => setRegisterForm({ ...registerForm, vendor_name: e.target.value })} 
                        />
                        
                        <TextField 
                            className="custom-textfield"
                            label="Contact number" 
                            hint="Enter your contact number" 
                            type="tel" 
                            value={registerForm.contact_no} 
                            onChange={(e) => setRegisterForm({ ...registerForm, contact_no: e.target.value })} 
                        />
                    </div>
                    
                    <TextField 
                        className="custom-textfield"
                        label="Email" 
                        hint="my.example@email.com" 
                        type="email" 
                        value={registerForm.vendor_email} 
                        onChange={(e) => setRegisterForm({ ...registerForm, vendor_email: e.target.value })} 
                    />

                    <div className="file-upload-field">
                        <span className="file-label">Business certificate</span>
                        <div className="file-input-container">
                            <input 
                                type="file" 
                                id="businessCertificate" 
                                accept="image/png, image/jpeg, image/jpg, image/webp" 
                                onChange={handleImageChange}
                                required
                            />
                            <label htmlFor="businessCertificate" className="file-upload-button">
                                {imagePreview ? "Change file" : "Choose file"}
                            </label>
                            {imageFile && <span className="file-name">{imageFile.name}</span>}
                        </div>
                        {imagePreview && (
                            <div className="image-preview-wrapper">
                                <img src={imagePreview} alt="Certificate Preview" className="image-preview" />
                            </div>
                        )}
                    </div>
                    
                    <TextField 
                        className="custom-textfield"
                        label="Address" 
                        hint="Enter your address" 
                        type="text" 
                        value={registerForm.vendor_address} 
                        onChange={(e) => setRegisterForm({ ...registerForm, vendor_address: e.target.value })} 
                    />
                    
                    <TextField 
                        className="custom-textfield"
                        label="Password" 
                        hint="Enter your password" 
                        type="password" 
                        value={registerForm.password} 
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} 
                    />
                    
                    <Button className="custom-button" label="Sign Up" type="submit" />
                </form>
                <div className="login-link">
                    Already have an account? <Link to="/User/Login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default VendorRegisterPage;