import { useState, useEffect } from "react";
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./style.css";
import MapPicker from "../../components/Map.jsx"; 


const AddProperty = () => {
    const [categories, setCategories] = useState([{ category_title: "Select Category", category_id: null }]);
    const [formData, setFormData] = useState({
        property_name: "",
        city: "",
        description: "",
        location: "",
        latitude: "", // Added for map location
        longitude: "", // Added for map location
        p_type: "",
        bhk: "",
        bedroom: "",
        bathroom: "",
        balcony: "",
        kitchen: "",
        wifi: "",
        utilities: "",
        parking: "",
        pool: "",
        pet_friendly: "",
        peoples: "",
        crib: "",
        availability_status: "",
        check_in_time: "",
        check_out_time: "",
        price_per_night: "",
        category_id: null,
        vendor_id: "",
    });

    const [images, setImages] = useState({ 
        pimage1: null, 
        pimage2: null, 
        pimage3: null, 
        pimage4: null, 
        pimage5: null 
    });
    const [fileNames, setFileNames] = useState({
        pimage1: "No file chosen",
        pimage2: "No file chosen",
        pimage3: "No file chosen",
        pimage4: "No file chosen",
        pimage5: "No file chosen"
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please log in as a vendor");
            setTimeout(() => navigate("/login"), 500);
            return;
        }
        getCategories();
    }, [navigate]);

    const getCategories = async () => {
        try {
            const response = await fetch(baseUrl + "getCategories.php");
            const data = await response.json();
            if (data.success) {
                setCategories([{ category_title: "Select Category", category_id: null }, ...data.categories]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error fetching categories");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setImages((prev) => ({ ...prev, [name]: files[0] }));
            setFileNames((prev) => ({ ...prev, [name]: files[0].name }));
        }
    };

    // Handler for map location selection
    const handleLocationSelect = (latlng) => {
        setFormData((prev) => ({
            ...prev,
            latitude: latlng.lat.toString(),
            longitude: latlng.lng.toString()
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate if location is selected on map
        if (!formData.latitude || !formData.longitude) {
            toast.error("Please select a location on the map");
            return;
        }
        
        const form = new FormData();
        
        // Add token to form data as well for backward compatibility
        const token = localStorage.getItem("token");
        form.append("token", token);
        
        Object.keys(formData).forEach((key) => form.append(key, formData[key]));
        Object.keys(images).forEach((key) => {
            if (images[key]) form.append(key, images[key]);
        });
        
        try {
            const response = await fetch(`${baseUrl}addProperty.php`, {
                method: "POST",
                body: form,
                headers: { 
                    Authorization: `Bearer ${token}`
                },
            });
            const result = await response.json();
            if (result.success) {
                toast.success("Property added successfully!");
                // Optionally navigate to dashboard
                navigate('/vendor/Home');
            } else {
                toast.error(result.message || "Failed to add property.");
            }
        } catch (error) {
            toast.error("Error adding property. Please try again.");
        }
    };

    return (
        <div className="app-wrapper">
            <div className="add-property-container">
                <h2 className="add-property-title">Add Property</h2>
                <form onSubmit={handleSubmit} className="add-property-form">
                    <div className="form-section-title full-width basic-info-section">Basic Information</div>
                    
                    <div>
                        <label>Property Name</label>
                        <input 
                            type="text" 
                            name="property_name" 
                            value={formData.property_name} 
                            onChange={handleChange} 
                            required 
                            placeholder="Enter property name"
                        />
                    </div>

                    <div>
                        <label>City</label>
                        <input 
                            type="text" 
                            name="city" 
                            value={formData.city} 
                            onChange={handleChange} 
                            required 
                            placeholder="Enter city"
                        />
                    </div>

                    <div>
                        <label>Location</label>
                        <input 
                            type="text" 
                            name="location" 
                            value={formData.location} 
                            onChange={handleChange} 
                            required 
                            placeholder="Enter full address"
                        />
                    </div>

                    {/* Map Location Picker */}
                    <div className="full-width map-container">
                        <label>Pin Location on Map</label>
                        <p className="map-instructions">Click on the map to select your property's exact location</p>
                        <MapPicker onSelect={handleLocationSelect} />
                        {formData.latitude && formData.longitude && (
                            <div className="selected-coordinates">
                                <p>Selected coordinates: {formData.latitude}, {formData.longitude}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Category</label>
                        <select 
                            name="category_id" 
                            value={formData.category_id} 
                            onChange={handleChange} 
                            required
                        >
                            {categories.map((category) => (
                                <option 
                                    key={category.category_id} 
                                    value={category.category_id}
                                >
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="full-width">
                        <label>Description</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            required
                            placeholder="Describe your property"
                        />
                    </div>

                    <div className="form-section-title full-width property-details-section">Property Details</div>

                    <div>
                        <label>Property Type</label>
                        <select name="p_type" value={formData.p_type} onChange={handleChange} required>
                            <option value="">Select Property Type</option>
                            {["Apartment", "Villa", "House"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>BHK (Bedroom-Hall-Kitchen)</label>
                        <select name="bhk" value={formData.bhk} onChange={handleChange} required>
                            <option value="">Select BHK</option>
                            {["1", "2", "3"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Bedrooms</label>
                        <select name="bedroom" value={formData.bedroom} onChange={handleChange} required>
                            <option value="">Select Bedrooms</option>
                            {["1", "2", "3", "4"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Bathrooms</label>
                        <select name="bathroom" value={formData.bathroom} onChange={handleChange} required>
                            <option value="">Select Bathrooms</option>
                            {["1", "2", "3", "4"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Balconies</label>
                        <select name="balcony" value={formData.balcony} onChange={handleChange} required>
                            <option value="">Select Balconies</option>
                            {["0", "1", "2", "3"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Kitchens</label>
                        <select name="kitchen" value={formData.kitchen} onChange={handleChange} required>
                            <option value="">Select Kitchens</option>
                            {["1", "2"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-section-title full-width amenities-section">Amenities</div>

                    <div>
                        <label>Wi-Fi</label>
                        <select name="wifi" value={formData.wifi} onChange={handleChange} required>
                            <option value="">Select Wi-Fi Option</option>
                            {["Wi-Fi", "No Wi-Fi"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Utilities</label>
                        <select name="utilities" value={formData.utilities} onChange={handleChange} required>
                            <option value="">Select Utilities Option</option>
                            {["Utilities Included", "Utilities not Included"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Parking</label>
                        <select name="parking" value={formData.parking} onChange={handleChange} required>
                            <option value="">Select Parking Option</option>
                            {["Parking Available", "No Parking Space"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Swimming Pool</label>
                        <select name="pool" value={formData.pool} onChange={handleChange} required>
                            <option value="">Select Pool Option</option>
                            {["Swimming Pool", "No Swimming Pool"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Pet Friendly</label>
                        <select name="pet_friendly" value={formData.pet_friendly} onChange={handleChange} required>
                            <option value="">Select Pet Option</option>
                            {["Pet Friendly", "Not Pet Friendly"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Max People</label>
                        <select name="peoples" value={formData.peoples} onChange={handleChange} required>
                            <option value="">Select Max People</option>
                            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Crib</label>
                        <select name="crib" value={formData.crib} onChange={handleChange} required>
                            <option value="">Select Crib Option</option>
                            {["Crib", "No Crib"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-section-title full-width availability-section">Availability & Pricing</div>

                    <div>
                        <label>Availability Status</label>
                        <select name="availability_status" value={formData.availability_status} onChange={handleChange} required>
                            <option value="">Select Availability</option>
                            {["Available", "Booked"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Price per Night ($)</label>
                        <input 
                            type="number" 
                            name="price_per_night" 
                            min="1" 
                            value={formData.price_per_night} 
                            onChange={handleChange} 
                            required 
                            placeholder="Enter price"
                        />
                    </div>

                    <div className="time-container full-width">
                        <div className="time-input">
                            <label>Check-in Time</label>
                            <select name="check_in_time" value={formData.check_in_time} onChange={handleChange} required>
                                <option value="">Select Check-in Time</option>
                                {[...Array(5)].map((_, i) => (
                                    <option key={i} value={`${14 + i}:00`}>
                                        {14 + i > 12 ? `${(14 + i) - 12}:00 PM` : `${14 + i}:00 AM`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="time-input">
                            <label>Check-out Time</label>
                            <select name="check_out_time" value={formData.check_out_time} onChange={handleChange} required>
                                <option value="">Select Check-out Time</option>
                                {[...Array(4)].map((_, i) => (
                                    <option key={i} value={`${8 + i}:00`}>{8 + i}:00 AM</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-section-title full-width images-section">Property Images</div>

                    {Object.keys(images).map((imgName, index) => (
                        <div key={imgName} className="file-input-container">
                            <label>Image {index + 1}</label>
                            <label className="file-input-label" htmlFor={imgName}>
                                Choose File
                            </label>
                            <input 
                                id={imgName}
                                type="file" 
                                name={imgName} 
                                accept="image/*" 
                                onChange={handleImageChange} 
                                required 
                            />
                            <div className="file-name">{fileNames[imgName]}</div>
                        </div>
                    ))}

                    <button type="submit" className="full-width">Add Property</button>
                </form>
            </div>
        </div>
    );
};

export default AddProperty;