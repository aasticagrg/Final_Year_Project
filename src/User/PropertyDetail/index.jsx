import { useEffect, useState, useContext } from "react";
import Navbar from "../../components/Navbar";
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { BookingContext } from "../../context";
import './style.css';

const PropertyDetails = () => {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState("");
    const params = useParams();
    const navigate = useNavigate();

    const { setBookingDetails} = useContext(BookingContext);
    
    useEffect(() => {
        fetchPropertyData();
    }, [params.id]);
    
    // Calculate total price when dates change
    useEffect(() => {
        calculateTotalPrice();
    }, [checkInDate, checkOutDate, property]);
    
    const fetchPropertyData = async () => {
        setLoading(true);
        try {
            const response = await fetch(baseUrl + "getOneProperty.php?" + new URLSearchParams({
                property_id: params.id
            }));
            const data = await response.json();
            
            if (data.success) {
                setProperty(data.property);
            } else {
                toast.error(data.message);
                navigate("/");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    
    const getAllPropertyImages = () => {
        if (!property) return [];
        
        return [
            property.pimage1,
            property.pimage2,
            property.pimage3,
            property.pimage4,
            property.pimage5
        ].filter(img => img);
    };
    
    const calculateTotalPrice = () => {
        setError("");
        
        if (!checkInDate || !checkOutDate || !property) {
            setTotalPrice(0);
            return;
        }
        
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        
        // Validate dates
        if (checkIn >= checkOut) {
            setError("Check-out date must be after check-in date");
            setTotalPrice(0);
            return;
        }
        
        // Calculate days difference
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        // Calculate total price
        const price = property.price_per_night * nights;
        setTotalPrice(price);
    };
    
    const handleBookNow = () => {
        if (!checkInDate || !checkOutDate) {
            setError("Please select check-in and check-out dates");
            return;
        }
        
        if (error) {
            return;
        }
        
        setBookingDetails({
            propertyName: property.property_name,
            location: property.location,
            city: property.city,
            checkInDate,
            checkOutDate,
            totalPrice,
            days: Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 3600 * 24)) // Calculate number of days
        });
        navigate("/User/BookingConfirm");
    };
    
    if (loading) {
        return (
            <div className="loader-wrapper">
                <div className="spinner-element"></div>
                <p>Fetching property information...</p>
            </div>
        );
    }
    
    const propertyImages = getAllPropertyImages();
    
    return (
        <>
            <Navbar />
            <div className="property-wrapper">
                <div className="property-heading-section">
                    <h1 className="property-name">{property?.property_name || "Property not found"}</h1>
                    <p className="property-address">
                        <span className="map-pin-icon">📍</span> {property?.location}, {property?.city}
                    </p>
                </div>
                
                <div className="photos-gallery-section">
                    <div className="main-photo-wrapper">
                        <img 
                            src={baseUrl + propertyImages[selectedImageIndex]} 
                            alt={property?.property_name} 
                            className="featured-property-photo" 
                        />
                    </div>
                    <div className="photo-thumbnails-row">
                        {propertyImages.map((img, index) => (
                            <img 
                                key={index}
                                src={baseUrl + img} 
                                alt={`${property?.property_name} - Photo ${index + 1}`}
                                className={`thumbnail-photo ${selectedImageIndex === index ? 'selected' : ''}`}
                                onClick={() => setSelectedImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>
                
                <div className="property-details-wrapper">
                    <div className="property-info-section">
                        <div className="description-wrapper">
                            <h2 className="info-section-heading">About this property</h2>
                            <p className="property-full-description">{property?.description || "No description available."}</p>
                            
                            <div className="property-specs-row">
                                <div className="spec-tag">
                                    <span className="spec-name">Property Type:</span> 
                                    <span className="spec-value">{property?.p_type}</span>
                                </div>
                                <div className="spec-tag">
                                    <span className="spec-name">BHK:</span> 
                                    <span className="spec-value">{property?.bhk}</span>
                                </div>
                                <div className="spec-tag">
                                    <span className="spec-name">Max People:</span> 
                                    <span className="spec-value">{property?.peoples}</span>
                                </div>
                                <div className="spec-tag">
                                    <span className="spec-name">Status:</span> 
                                    <span className={`spec-value ${property?.availability_status === "Available" ? 'available-status' : 'unavailable-status'}`}>
                                        {property?.availability_status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="booking-summary-box">
                            <div className="nightly-rate">
                                <span className="rate-number">Rs. {property?.price_per_night}</span>
                                <span className="rate-period">/ night</span>
                            </div>
                            
                            <div className="booking-form">
                                <h3 className="booking-form-title">Book Your Stay</h3>
                                
                                <div className="booking-date-field">
                                    <label htmlFor="check-in-date">Check-in date</label>
                                    <input 
                                        type="date" 
                                        id="check-in-date" 
                                        value={checkInDate}
                                        onChange={(e) => setCheckInDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                
                                <div className="booking-date-field">
                                    <label htmlFor="check-out-date">Check-out date</label>
                                    <input 
                                        type="date" 
                                        id="check-out-date" 
                                        value={checkOutDate}
                                        onChange={(e) => setCheckOutDate(e.target.value)}
                                        min={checkInDate || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                
                                {error && <div className="booking-error">{error}</div>}
                                
                                {totalPrice > 0 && (
                                    <div className="booking-total">
                                        <span className="total-label">Total:</span>
                                        <span className="total-price">Rs. {totalPrice}</span>
                                    </div>
                                )}
                                
                                <button 
                                    className="booking-button"
                                    onClick={handleBookNow}
                                    disabled={!checkInDate || !checkOutDate || !!error}
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="features-amenities-section">
                        <h2 className="features-heading">Features & Amenities</h2>
                        <div className="features-divider"></div>
                        
                        <div className="features-column">
                            <h3 className="section-subheading">Room Configuration</h3>
                            <div className="feature-row">
                                <span className="feature-icon">🛏️</span>
                                <span className="feature-label">Bedrooms:</span>
                                <span className="feature-value">{property?.bedroom}</span>
                            </div>
                            <div className="feature-row">
                                <span className="feature-icon">🚿</span>
                                <span className="feature-label">Bathrooms:</span>
                                <span className="feature-value">{property?.bathroom}</span>
                            </div>
                            <div className="feature-row">
                                <span className="feature-icon">🏠</span>
                                <span className="feature-label">Balconies:</span>
                                <span className="feature-value">{property?.balcony}</span>
                            </div>
                            <div className="feature-row">
                                <span className="feature-icon">🍳</span>
                                <span className="feature-label">Kitchen:</span>
                                <span className="feature-value">{property?.kitchen}</span>
                            </div>
                        </div>
                        
                        <div className="amenities-column">
                            <h3 className="section-subheading">Amenities</h3>
                            <div className="amenities-grid">
                                <div className="amenity-item">
                                    <span className="amenity-name">WiFi:</span>
                                    <span className="amenity-value">{property?.wifi}</span>
                                </div>
                                <div className="amenity-item">
                                    <span className="amenity-name">Utilities Included:</span>
                                    <span className="amenity-value">{property?.utilities}</span>
                                </div>
                                <div className="amenity-item">
                                    <span className="amenity-name">Parking:</span>
                                    <span className="amenity-value">{property?.parking}</span>
                                </div>
                                <div className="amenity-item">
                                    <span className="amenity-name">Swimming Pool:</span>
                                    <span className="amenity-value">{property?.pool}</span>
                                </div>
                                <div className="amenity-item">
                                    <span className="amenity-name">Pet Friendly:</span>
                                    <span className="amenity-value">{property?.pet_friendly}</span>
                                </div>
                                <div className="amenity-item">
                                    <span className="amenity-name">Baby Crib Available:</span>
                                    <span className="amenity-value">{property?.crib}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="rules-section">
                            <h3 className="section-subheading">Rules</h3>
                            <div className="rules-container">
                                <div className="rule-item">
                                    <span className="rule-name">Check In</span>
                                    <span className="rule-value">{property?.check_in_time}</span>
                                </div>
                                <div className="rule-item">
                                    <span className="rule-name">Check Out</span>
                                    <span className="rule-value">{property?.check_out_time}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PropertyDetails;