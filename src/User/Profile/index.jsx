import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Import navigate
import Navbar from "../../components/Navbar";
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import "./style.css";

const ProfilePage = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [initialUser, setInitialUser] = useState(null); // Initialize initialUser state
    const [user, setUser] = useState({
        name: "",
        phone_no: "",
        user_address: "",
        email: "",
        user_verification: null
    });
    const [loading, setLoading] = useState(true);

    // Fetch user details from the server
    const getUserDetails = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You need to be logged in to view this page.");
                navigate("/User/login");
                return;
            }

            setLoading(true);
            const response = await fetch(`${baseUrl}getUserDetails.php`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Check if response is valid JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server didn't return JSON");
            }

            const data = await response.json();

            console.log("API Response:", data);  // Log the response to debug

            if (data.success) {
                setUser(data.user); // Set the user data in state
                setInitialUser(data.user); // Set the initial user data
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to get user details: " + error.message);
            console.error("Error fetching user details:", error);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        getUserDetails();
    }, [getUserDetails]);

    // Handle verification document upload
    const handleVerificationUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size should be less than 5MB");
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please upload an image file");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setUser({ ...user, user_verification: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // Update user profile
    const updateUserProfile = async () => {
        if (!initialUser) {
            toast.error("User data not loaded properly");
            return;
        }

        // Check if there are any changes
        if (
            user.name === initialUser.name &&
            user.phone_no === initialUser.phone_no &&
            user.user_address === initialUser.user_address &&
            user.user_verification === initialUser.user_verification
        ) {
            toast("No changes detected.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You need to be logged in!");
            navigate("/User/login");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', user.name);
            formData.append('phone_no', user.phone_no);
            formData.append('user_address', user.user_address);
            
            if (user.user_verification && user.user_verification !== initialUser.user_verification) {
                formData.append('user_verification', user.user_verification);
            }

            const response = await fetch(`${baseUrl}updateUserDetails.php`, {
                method: "POST",
                headers: { 
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            // Check if response is valid JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server didn't return JSON");
            }

            const data = await response.json();

            if (data.success) {
                toast.success("Profile updated successfully!");
                setInitialUser(user);
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile: " + error.message);
        }
    };

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <div className="profile-header">
                    <img 
                        className="profile-cover-image" 
                        src="/assets/color.jpg"
                        alt="Profile cover" 
                    />
                    <div className="profile-avatar">
                        {user?.name && (
                            <span className="profile-initials">
                                {user.name.slice(0, 2).toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="profile-content">
                    <span className="profile-title">My Profile</span>

                    <div className="profile-form">
                        {loading ? (
                            <span>Loading...</span>
                        ) : (
                            <>
                                <div className="form-group">
                                    <label htmlFor="name">Full Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={user.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={user.email}
                                        disabled
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="phone_no">Phone:</label>
                                    <input
                                        type="tel"
                                        id="phone_no"
                                        name="phone_no"
                                        value={user.phone_no}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="user_address">Address:</label>
                                    <textarea
                                        id="user_address"
                                        name="user_address"
                                        value={user.user_address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Verification Document:</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleVerificationUpload}
                                    />
                                    {user.user_verification && (
                                        <img 
                                            src={user.user_verification} 
                                            alt="Verification document" 
                                            style={{ 
                                                maxWidth: '200px', 
                                                marginTop: '10px' 
                                            }} 
                                        />
                                    )}
                                </div>

                                <button className="btn btn-primary" onClick={updateUserProfile}>
                                    Update Profile
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;