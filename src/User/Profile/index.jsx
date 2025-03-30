import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import "./style.css";

const ProfilePage = () => {
    const [user, setUser] = useState(null);

    // Fetch user details from the server
    const getUserDetails = async () => {
        try {
            const response = await fetch(baseUrl + "getUserDetails.php?" + new URLSearchParams({
                token: localStorage.getItem("token")
            }));

            const data = await response.json();

            console.log("API Response:", data);  // Log the response to debug

            if (data.success) {
                setUser(data.user); // Set the user data in state
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error("Failed to get user details");
            console.error("Error fetching user details:", error);  // Log the actual error
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("You need to be logged in to view this page.");
        } else {
            getUserDetails();
        }
    }, []);

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <div className="profile-header">
                    <img 
                        className="profile-cover-image" 
                        src="\assets\color.jpg"
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

                    <div className="profile-details">
                        {user ? (
                            <>
                                <span><strong>Full Name:</strong> {user.name}</span>
                                <span><strong>Email:</strong> {user.email}</span>
                                <span><strong>Phone:</strong> {user.phone_no}</span>
                                <span><strong>Address:</strong> {user.user_address}</span>
                            </>
                        ) : (
                            <span>Loading...</span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfilePage;