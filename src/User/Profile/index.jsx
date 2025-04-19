import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import "./style.css";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [initialUser, setInitialUser] = useState(null);
    const [user, setUser] = useState({
        name: "",
        phone_no: "",
        user_address: "",
        email: "",
        user_verification: null,
        verification_status: "" // added
    });
    const [loading, setLoading] = useState(true);
    const [newFileSelected, setNewFileSelected] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

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

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server didn't return JSON");
            }

            const data = await response.json();
            if (data.success) {
                setUser(data.user);
                setInitialUser(data.user);
                setNewFileSelected(false);
                setPreviewUrl(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to get user details: " + error.message);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        getUserDetails();
    }, [getUserDetails]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleVerificationUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size should be less than 5MB");
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error("Please upload an image file");
                return;
            }

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setUser(prev => ({ ...prev, user_verification: file }));
            setNewFileSelected(true);
        }
    };

    const updateUserProfile = async () => {
        if (!initialUser) {
            toast.error("User data not loaded properly");
            return;
        }

        if (
            user.name === initialUser.name &&
            user.phone_no === initialUser.phone_no &&
            user.user_address === initialUser.user_address &&
            !newFileSelected
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
            if (newFileSelected && user.user_verification instanceof File) {
                formData.append('user_verification', user.user_verification);
            }

            const response = await fetch(`${baseUrl}updateUserDetails.php`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Profile updated successfully!");
                getUserDetails();
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile: " + error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const getVerificationBadge = (status) => {
        switch (status) {
            case "verified":
                return <span className="badge badge-verified">Verified</span>;
            case "rejected":
                return <span className="badge badge-rejected">Rejected</span>;
            case "pending":
                return <span className="badge badge-pending">Pending</span>;
            default:
                return <span className="badge badge-not-submitted">Not Verified</span>;
        }
    };

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <div className="profile-header">
                    <img className="profile-cover-image" src="/assets/color.jpg" alt="Profile cover" />
                    <div className="profile-avatar">
                        {user?.name && (
                            <span className="profile-initials">
                                {user.name.slice(0, 2).toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="profile-content">
                    <div className="profile-header-row">
                        <span className="profile-title">My Profile</span>
                        <div className="verification-status">
                            {getVerificationBadge(user.verification_status)}
                        </div>
                    </div>

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

                                    {previewUrl && (
                                        <img
                                            src={previewUrl}
                                            alt="New verification document"
                                            style={{ maxWidth: '200px', marginTop: '10px', display: 'block' }}
                                        />
                                    )}

                                    {!previewUrl && user.user_verification && typeof user.user_verification === 'string' && (
                                        <img
                                            src={`${baseUrl}${user.user_verification}`}
                                            alt="Verification document"
                                            style={{ maxWidth: '200px', marginTop: '10px', display: 'block' }}
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
