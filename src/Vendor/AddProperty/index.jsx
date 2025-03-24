import { useState, useEffect } from "react";
import { baseUrl } from "../../constants";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./style.css"; 

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
    const [formKey, setFormKey] = useState(0);
    const [images, setImages] = useState({ pimage1: null, pimage2: null, pimage3: null });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "vendor") {
            toast.error("Please log in as a vendor to add properties");
            setTimeout(() => navigate("/login"), 500);
            return;
        }

        const loadVendorData = async () => {
            setLoading(true);
            try {
                const storedVendor = localStorage.getItem("vendor");
                if (storedVendor) {
                    const vendor = JSON.parse(storedVendor);
                    if (vendor?.vendor_id) {
                        setFormData((prev) => ({ ...prev, vendor_id: vendor.vendor_id }));
                        setVendorData(vendor);
                        setLoading(false);
                        return;
                    }
                }

                const response = await fetch(`${baseUrl}vendor/profile.php`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await response.json();
                if (data?.success && data.vendor?.vendor_id) {
                    localStorage.setItem("vendor", JSON.stringify(data.vendor));
                    setFormData((prev) => ({ ...prev, vendor_id: data.vendor.vendor_id }));
                    setVendorData(data.vendor);
                } else {
                    throw new Error(data.message || "Could not retrieve vendor information");
                }
            } catch (error) {
                toast.error("Could not load vendor information. Please try logging in again.");
                setTimeout(() => navigate("/login"), 500);
            } finally {
                setLoading(false);
            }
        };

        loadVendorData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "price_per_night" && value < 1) return;
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
            setTimeout(() => navigate("/login"), 500);
            return;
        }

        const form = new FormData();
        Object.keys(formData).forEach((key) => form.append(key, formData[key]));
        Object.keys(images).forEach((key) => {
            if (images[key]) form.append(key, images[key]);
        });

        try {
            const response = await fetch(`${baseUrl}addProperty.php`, {
                method: "POST",
                body: form,
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            const result = await response.json();
            if (result.success) {
                toast.success("Property added successfully!");
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
                setFormKey((prevKey) => prevKey + 1);
            } else {
                toast.error(result.message || "Failed to add property.");
            }
        } catch (error) {
            toast.error("Error adding property. Please try again.");
        }
    };

    if (loading) {
        return <div className="loading">Loading vendor information...</div>;
    }

    return (
        <div className="add-property-container">
            <h2 className="add-property-title">Add Property</h2>

            {vendorData && (
                <div className="vendor-info">
                    <p><strong>Vendor:</strong> {vendorData.vendor_name}</p>
                    <p><strong>Email:</strong> {vendorData.vendor_email}</p>
                    <p><strong>Vendor ID:</strong> {vendorData.vendor_id}</p>
                </div>
            )}

            <form key={formKey} onSubmit={handleSubmit} className="add-property-form">
                <label>Property Name</label>
                <input className="input-field" name="property_name" value={formData.property_name} onChange={handleChange} required />

                <label>City</label>
                <input className="input-field" name="city" value={formData.city} onChange={handleChange} required />

                <label>Property Type</label>
                <select className="select-field" name="p_type" value={formData.p_type} onChange={handleChange} required>
                    <option value="">Select Type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="House">House</option>
                </select>

                <label>BHK</label>
                <select className="select-field" name="bhk" value={formData.bhk} onChange={handleChange} required>
                    <option value="">Select BHK</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                </select>

                <label>Availability Status</label>
                <select className="select-field" name="availability_status" value={formData.availability_status} onChange={handleChange} required>
                    <option value="">Select Status</option>
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                </select>

                <label>Price per Night</label>
                <input className="input-field" name="price_per_night" type="number" min="1" value={formData.price_per_night} onChange={handleChange} required />

                <label>Property Images</label>
                {["pimage1", "pimage2", "pimage3"].map((imgName, index) => (
                    <div key={imgName} className="image-upload">
                        <label>{index === 0 ? "Main Image" : `Additional Image ${index}`}</label>
                        <input type="file" name={imgName} accept="image/*" onChange={handleImageChange} required />
                    </div>
                ))}

                <Button type="submit" label="Add Property" className="submit-button" />
            </form>
        </div>
    );
};

export default AddProperty;
