import { useEffect, useState, useContext } from "react";
import Navbar from "../../components/Navbar";
import { baseUrl } from "../../constants";
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";
import { BookingContext } from "../../context";
import DatePicker from "react-datepicker";
import ReviewForm from "../../components/ReviewForm";
import ReviewList from "../../components/ReviewList";
import "react-datepicker/dist/react-datepicker.css";
import './style.css';

const PropertyDetail = () => {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState("");
    const [bookedDates, setBookedDates] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const { id } = useParams();

    const params = useParams();
    const navigate = useNavigate();

    const { setBookingDetails } = useContext(BookingContext);

    useEffect(() => {
        fetchPropertyData();
    }, [params.id]);

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
                if (data.booked_dates) {
                    const booked = data.booked_dates.flatMap(range => {
                        const dates = [];
                        let current = new Date(range.check_in_date);
                        const end = new Date(range.check_out_date);
                        while (current < end) {
                            dates.push(new Date(current));
                            current.setDate(current.getDate() + 1);
                        }
                        
                        return dates;
                    });
                    setBookedDates(booked);
                }
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

        if (checkIn >= checkOut) {
            setError("Check-out date must be after check-in date");
            setTotalPrice(0);
            return;
        }

        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        const price = property.price_per_night * nights;
        setTotalPrice(price);
    };

    const handleBookNow = () => {
        const user = JSON.parse(localStorage.getItem("user"));
    
        if (!user) {
            toast.error("You need to login to book a property!");
            navigate("/User/Login");
            return;
        }
    
        if (!checkInDate || !checkOutDate) {
            toast.error("Please select check-in and check-out dates");
            setError("Please select check-in and check-out dates");
            return;
        }
    
        if (error) return;
    

        setBookingDetails({
            property: {
                property_id: property.property_id,
                property_name: property.property_name,
                location: property.location,
                city: property.city,
                price_per_night: property.price_per_night,
                max_guests: property.peoples,
                vendor_id: property.vendor_id,
                vendor_name: property.vendor_name,
                vendor_phone: property.contact_no
            },
            checkInDate,
            checkOutDate,
            totalPrice,
            days: Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 3600 * 24))
        });

        navigate("/User/BookingConfirm");
    };
   
    const handleReviewSubmission = () => {
        // After review is submitted, trigger a refresh of the reviews
        setRefreshTrigger((prev) => prev + 1); // Increment the trigger value to re-fetch reviews
        toast.success("Review submitted successfully!");
    };

    const toggleReviews = () => {
        setShowAllReviews(!showAllReviews);
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

    // ✅ Proper check for disabled dates
    const isDateDisabled = (date) => {
        return bookedDates.some(disabled =>
            date.getFullYear() === disabled.getFullYear() &&
            date.getMonth() === disabled.getMonth() &&
            date.getDate() === disabled.getDate()
        );
    };

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
                            src={baseUrl + propertyImages[selectedImageIndex] || "/placeholder.svg"} 
                            alt={property?.property_name} 
                            className="featured-property-photo" 
                        />
                    </div>
                    <div className="photo-thumbnails-row">
                        {propertyImages.map((img, index) => (
                            <img 
                                key={index}
                                src={baseUrl + img || "/placeholder.svg"} 
                                alt={`${property?.property_name} ${index + 1}`}
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
                                <div className="spec-tag"><span className="spec-name">Property Type:</span> <span className="spec-value">{property?.p_type}</span></div>
                                <div className="spec-tag"><span className="spec-name">BHK:</span> <span className="spec-value">{property?.bhk}</span></div>
                                <div className="spec-tag"><span className="spec-name">Max People:</span> <span className="spec-value">{property?.peoples}</span></div>
                                <div className="spec-tag"><span className="spec-name">Status:</span> 
                                    <span className={`spec-value ${property?.availability_status === "Available" ? 'available-status' : 'unavailable-status'}`}>
                                        {property?.availability_status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <h2 className="section-title">Features & Amenities</h2>
                        <div className="features-amenities-container">
                            <div className="room-configuration-section">
                                <h3 className="section-subheading">Room Configuration</h3>
                                <div className="feature-item"><span className="feature-icon">🛏️</span><span className="feature-label">Bedrooms:</span><span className="feature-value">{property?.bedroom}</span></div>
                                <div className="feature-item"><span className="feature-icon">🚿</span><span className="feature-label">Bathrooms:</span><span className="feature-value">{property?.bathroom}</span></div>
                                <div className="feature-item"><span className="feature-icon">🏠</span><span className="feature-label">Balconies:</span><span className="feature-value">{property?.balcony}</span></div>
                                <div className="feature-item"><span className="feature-icon">🍳</span><span className="feature-label">Kitchen:</span><span className="feature-value">{property?.kitchen}</span></div>
                            </div>

                            <div className="vendor-info-section">
                                <h3 className="section-subheading">Vendor Information</h3>
                                <div className="feature-item"><span className="feature-icon">👤</span><span className="feature-label">Name:</span><span className="feature-value">{property?.vendor_name}</span></div>
                                <div className="feature-item"><span className="feature-icon">📞</span><span className="feature-label">Phone:</span><span className="feature-value">{property?.contact_no}</span></div>
                            </div>
                        </div>

                        <div className="amenities-section">
                            <h3 className="section-subheading">Amenities</h3>
                            <div className="amenities-grid">
                                <div className="amenity-item"><span className="amenity-label">WiFi:</span><span className="amenity-value">{property?.wifi}</span></div>
                                <div className="amenity-item"><span className="amenity-label">Utilities Included:</span><span className="amenity-value">{property?.utilities}</span></div>
                                <div className="amenity-item"><span className="amenity-label">Parking:</span><span className="amenity-value">{property?.parking}</span></div>
                                <div className="amenity-item"><span className="amenity-label">Swimming Pool:</span><span className="amenity-value">{property?.pool}</span></div>
                                <div className="amenity-item"><span className="amenity-label">Pet Friendly:</span><span className="amenity-value">{property?.pet_friendly}</span></div>
                                <div className="amenity-item"><span className="amenity-label">Baby Crib:</span><span className="amenity-value">{property?.crib}</span></div>
                            </div>
                        </div>

                        <div className="rules-section">
                            <h3 className="section-subheading">Rules</h3>
                            <div className="rules-grid">
                                <div className="rule-item"><span className="rule-label">Check In:</span><span className="rule-value">14:00 pm</span></div>
                                <div className="rule-item"><span className="rule-label">Check Out:</span><span className="rule-value">12:00 pm</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="booking-sidebar">
                        <div className="booking-summary-box">
                            <div className="nightly-rate">
                                <span className="rate-number">Rs. {property?.price_per_night}</span>
                                <span className="rate-period">/night</span>
                            </div>

                            <div className="booking-form">
                                <h3 className="booking-form-title">Book Your Stay</h3>

                                <div className="booking-date-field">
                                    <label htmlFor="check-in-date">Check in date</label>
                                    <DatePicker
                                        id="check-in-date"
                                        selected={checkInDate ? new Date(checkInDate) : null}
                                        onChange={(date) => setCheckInDate(date)}
                                        minDate={new Date()}
                                        filterDate={(date) => !isDateDisabled(date)}
                                        placeholderText="Select Check-in Date"
                                    />
                                </div>

                                <div className="booking-date-field">
                                    <label htmlFor="check-out-date">Check out date</label>
                                    <DatePicker
                                        id="check-out-date"
                                        selected={checkOutDate ? new Date(checkOutDate) : null}
                                        onChange={(date) => setCheckOutDate(date)}
                                        minDate={checkInDate ? new Date(checkInDate) : new Date()}
                                        filterDate={(date) => !isDateDisabled(date)}
                                        placeholderText="Select Check-out Date"
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
                </div>
                <div className="property-review-section">
                    <h2 className="section-title">Ratings & Reviews</h2>
                    
                    <div className={`reviews-container ${showAllReviews ? 'expanded' : ''}`}>
                        <ReviewList 
                            propertyId={id} 
                            refreshTrigger={refreshTrigger}
                            limitReviews={!showAllReviews ? 3 : 0}
                        />
                        
                        <div className="see-all-reviews-container">
                            <button 
                                className="see-all-reviews-button" 
                                onClick={toggleReviews}
                            >
                                {showAllReviews ? 'Show Less Reviews' : 'See All Reviews'}
                            </button>
                        </div>
                    </div>
      
                    {property && (
                    <ReviewForm
                        propertyId={property.property_id}
                        onReviewSubmitted={handleReviewSubmission}
                    />
                    )}
                </div>
            </div>
        </>
    );
};

export default PropertyDetail;