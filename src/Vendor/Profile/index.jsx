import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import "./style.css";

const VendorProfilePage = () => {
    const navigate = useNavigate();
    const [initialVendor, setInitialVendor] = useState(null);
    const [vendor, setVendor] = useState({
        vendor_name: "",
        contact_no: "",
        vendor_address: "",
        vendor_email: "",
        vendor_verification: null,
        verification_status: "" // Add verification status
    });
    const [loading, setLoading] = useState(true);
    const [newFileSelected, setNewFileSelected] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const getVendorDetails = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You need to be logged in to view this page.");
                navigate("/vendor/login");
                return;
            }

            setLoading(true);
            const response = await fetch(`${baseUrl}getVendorDetails.php`, {
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
                setVendor(data.vendor);
                setInitialVendor(data.vendor);
                setNewFileSelected(false);
                setPreviewUrl(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to get vendor details: " + error.message);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        getVendorDetails();
    }, [getVendorDetails]);

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
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                toast.error("Please upload a valid image file (JPG, PNG).");
                return;
            }

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setVendor(prev => ({ ...prev, vendor_verification: file }));
            setNewFileSelected(true);
        }
    };

    const updateVendorProfile = async () => {
        if (!vendor.vendor_name.trim()) {
            toast.error("Vendor name cannot be empty.");
            return;
        }
        if (!vendor.contact_no.trim()) {
            toast.error("Phone number cannot be empty.");
            return;
        }
        if (!vendor.vendor_address.trim()) {
            toast.error("Address cannot be empty.");
            return;
        }

        if (!initialVendor) {
            toast.error("Vendor data not loaded properly");
            return;
        }

        if (
            vendor.vendor_name === initialVendor.vendor_name &&
            vendor.contact_no === initialVendor.contact_no &&
            vendor.vendor_address === initialVendor.vendor_address &&
            !newFileSelected
        ) {
            toast("No changes detected.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You need to be logged in!");
            navigate("/vendor/login");
            return;
        }

        // Prevent profile update if the vendor is verified and a new file is selected
        if (vendor.verification_status === 'verified' && newFileSelected) {
            toast.error("You cannot update the verification document once verified.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('vendor_name', vendor.vendor_name);
            formData.append('contact_no', vendor.contact_no);
            formData.append('vendor_address', vendor.vendor_address);

            if (newFileSelected && vendor.vendor_verification instanceof File) {
                formData.append('vendor_verification', vendor.vendor_verification);
            }

            const response = await fetch(`${baseUrl}updateVendorDetails.php`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Profile updated successfully!");
                getVendorDetails();
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
        setVendor({ ...vendor, [name]: value });
    };

    const getVerificationBadge = (status) => {
        switch(status) {
            case 'verified':
                return <span className="badge badge-verified">Verified</span>;

            case 'rejected':
                return <span className="badge badge-rejected">Rejected</span>;

            default:
                return <span className="badge badge-not-submitted">Not Verified</span>;
        }
    };

    return (
        <div className="vendor-profile-container">
            <div className="vendor-profile-header">
                <h1>Vendor Profile</h1>
                <div className="verification-status">
                    {vendor.verification_status && 
                        getVerificationBadge(vendor.verification_status)
                    }
                </div>
            </div>

            <div className="vendor-profile-content">
                {loading ? (
                    <div className="loading-spinner">Loading...</div>
                ) : (
                    <div className="vendor-profile-form">
                        <div className="form-group">
                            <label htmlFor="vendor_name">Full Name:</label>
                            <input
                                type="text"
                                id="vendor_name"
                                name="vendor_name"
                                value={vendor.vendor_name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="vendor_email">Email:</label>
                            <input
                                type="email"
                                id="vendor_email"
                                name="vendor_email"
                                value={vendor.vendor_email}
                                disabled
                                className="disabled-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact_no">Phone:</label>
                            <input
                                type="tel"
                                id="contact_no"
                                name="contact_no"
                                value={vendor.contact_no}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="vendor_address">Address:</label>
                            <textarea
                                id="vendor_address"
                                name="vendor_address"
                                value={vendor.vendor_address}
                                onChange={handleInputChange}
                                rows="4"
                            />
                        </div>

                        <div className="form-group verification-document">
                            <label>Verification Document:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleVerificationUpload}
                                className="file-input"
                                disabled={vendor.verification_status === 'verified'}
                            />
                            <small className="form-text">
                                {vendor.verification_status === 'verified' 
                                    ? "Your account is verified. You cannot upload a new document unless verification is reset." 
                                    : "Upload an image file less than 5MB"}
                            </small>

                            <div className="document-preview">
                                {previewUrl && (
                                    <div className="preview-container">
                                        <img 
                                            src={previewUrl}
                                            alt="New verification document" 
                                            className="document-image"
                                        />
                                        <span className="preview-label">New document</span>
                                    </div>
                                )}

                                {!previewUrl && vendor.vendor_verification && typeof vendor.vendor_verification === 'string' && (
                                    <div className="preview-container">
                                        <img 
                                            src={`${baseUrl}${vendor.vendor_verification}`}
                                            alt="Current verification document" 
                                            className="document-image"
                                        />
                                        <span className="preview-label">Current document</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="btn btn-primary" onClick={updateVendorProfile}>
                                Update Profile
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorProfilePage;
