import { useState, useEffect } from "react";
import { baseUrl } from "../../constants";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
    const [formData, setFormData] = useState({
        property_name: "",
        city: "",
        description: "",
        location: "",
        p_type: "",
        bhk: "",
        bedroom: "",
        bathroom: "",
        balcony: "",
        kitchen: "",
        availability_status: "",
        price_per_night: "",
        vendor_id: "",
    });
    
    const [vendorData, setVendorData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [images, setImages] = useState({
        pimage1: null,
        pimage2: null,
        pimage3: null,
    });
    
    const navigate = useNavigate();

    // Load vendor data on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        
        // Check if user is logged in and is a vendor
        if (!token || role !== "vendor") {
            toast.error("Please log in as a vendor to add properties");
            navigate("/login");
            return;
        }

        const loadVendorData = async () => {
            setLoading(true);
            try {
                // First try to get vendor data from localStorage
                const storedVendor = localStorage.getItem("vendor");
                
                if (storedVendor) {
                    try {
                        const vendor = JSON.parse(storedVendor);
                        if (vendor && vendor.vendor_id) {
                            setFormData(prev => ({ ...prev, vendor_id: vendor.vendor_id }));
                            setVendorData(vendor);
                            console.log("Vendor data loaded from localStorage:", vendor);
                            setLoading(false);
                            return;
                        }
                    } catch (error) {
                        console.error("Error parsing vendor data from localStorage:", error);
                    }
                }
                
                // If no valid data in localStorage, fetch from API
                console.log("Fetching vendor data from API...");
                const response = await fetch(`${baseUrl}vendor/profile.php`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                const data = await response.json();
                if (data.success && data.vendor && data.vendor.vendor_id) {
                    // Store vendor data in localStorage for future use
                    localStorage.setItem("vendor", JSON.stringify(data.vendor));
                    setFormData(prev => ({ ...prev, vendor_id: data.vendor.vendor_id }));
                    setVendorData(data.vendor);
                    console.log("Vendor data fetched from API:", data.vendor);
                } else {
                    throw new Error(data.message || "Could not retrieve vendor information");
                }
            } catch (error) {
                console.error("Error loading vendor data:", error);
                toast.error("Could not load vendor information. Please try logging in again.");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        
        loadVendorData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setImages((prev) => ({ ...prev, [name]: files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.vendor_id) {
            toast.error("Vendor ID is missing. Please log in again.");
            navigate("/login");
            return;
        }

        const form = new FormData();
        Object.keys(formData).forEach((key) => form.append(key, formData[key]));
        Object.keys(images).forEach((key) => {
            if (images[key]) form.append(key, images[key]);
        });

        try {
            console.log("Submitting property with vendor_id:", formData.vendor_id);
            const response = await fetch(`${baseUrl}addProperty.php`, {
                method: "POST",
                body: form,
            });

            const result = await response.json();
            if (result.success) {
                toast.success("Property added successfully!");
                // Reset form but keep vendor_id
                setFormData({
                    property_name: "",
                    city: "",
                    description: "",
                    location: "",
                    p_type: "",
                    bhk: "",
                    bedroom: "",
                    bathroom: "",
                    balcony: "",
                    kitchen: "",
                    availability_status: "",
                    price_per_night: "",
                    vendor_id: formData.vendor_id,
                });
                setImages({ pimage1: null, pimage2: null, pimage3: null });
                
                // Reset file input fields
                const fileInputs = document.querySelectorAll('input[type="file"]');
                fileInputs.forEach(input => {
                    input.value = '';
                });
            } else {
                toast.error(result.message || "Failed to add property.");
                console.error("Server response:", result);
            }
        } catch (error) {
            console.error("Error submitting property:", error);
            toast.error("Error adding property. Please try again.");
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading vendor information...</div>;
    }

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
            <h2>Add Property</h2>
            
            {vendorData && (
                <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
                    <p><strong>Vendor:</strong> {vendorData.vendor_name}</p>
                    <p><strong>Email:</strong> {vendorData.vendor_email}</p>
                    <p><strong>Vendor ID:</strong> {vendorData.vendor_id}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="property_name">Property Name</label>
                    <input
                        id="property_name"
                        name="property_name"
                        value={formData.property_name}
                        onChange={handleChange}
                        required
                        placeholder="Enter property name"
                    />
                </div>
                <div>
                    <label htmlFor="city">City</label>
                    <input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="Enter city"
                    />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Enter property description"
                        rows="4"
                        style={{ width: "100%", padding: "8px" }}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="location">Location</label>
                    <input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        placeholder="Enter property location"
                    />
                </div>
                <div>
                    <label htmlFor="p_type">Property Type</label>
                    <select
                        id="p_type"
                        name="p_type"
                        required
                        value={formData.p_type}
                        onChange={handleChange}
                    >
                        <option value="">Select Property Type</option>
                        {["House", "Apartment", "Villa"].map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="bhk">BHK</label>
                    <select
                        id="bhk"
                        name="bhk"
                        required
                        value={formData.bhk}
                        onChange={handleChange}
                    >
                        <option value="">Select BHK</option>
                        {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK"].map((bhk) => (
                            <option key={bhk} value={bhk}>
                                {bhk}
                            </option>
                        ))}
                    </select>
                </div>
                {["bedroom", "bathroom", "balcony", "kitchen"].map((field) => (
                    <div key={field}>
                        <label htmlFor={field}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <select
                            id={field}
                            name={field}
                            required
                            value={formData[field]}
                            onChange={handleChange}
                        >
                            <option value="">Select {field}</option>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
                <div>
                    <label htmlFor="availability_status">Availability Status</label>
                    <select
                        id="availability_status"
                        name="availability_status"
                        required
                        value={formData.availability_status}
                        onChange={handleChange}
                    >
                        <option value="">Select Status</option>
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="price_per_night">Price per Night</label>
                    <input
                        id="price_per_night"
                        name="price_per_night"
                        value={formData.price_per_night}
                        onChange={handleChange}
                        required
                        type="number"
                        min="1"
                        placeholder="Enter price per night"
                    />
                </div>
                <div>
                    <label>Property Images</label>
                    {["pimage1", "pimage2", "pimage3"].map((imageName, index) => (
                        <div key={imageName} style={{ marginBottom: "10px" }}>
                            <label htmlFor={imageName}>
                                {index === 0 ? "Main Image" : `Additional Image ${index}`}
                            </label>
                            <input
                                id={imageName}
                                type="file"
                                name={imageName}
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                            />
                        </div>
                    ))}
                </div>
                <Button type="submit" label="Add Property" />
            </form>
        </div>
    );
};

export default AddProperty;