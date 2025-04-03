import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { BookingContext } from "../../context";
import { baseUrl } from "../../constants";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import "./style.css";

const BookingConfirm = () => {
    const navigate = useNavigate();
    const { bookingDetails, setBookingDetails, clearBookingDetails } = useContext(BookingContext);
    const [total, setTotal] = useState(0);
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        phone_no: "",
        user_address: "",
        user_verification: null
    });
    const [arrivalTime, setArrivalTime] = useState("");
    const [fullGuestName, setFullGuestName] = useState("");

    useEffect(() => {
        if (!bookingDetails || !bookingDetails.property) {
            return;
        }
        
        const totalPrice = bookingDetails.property.price_per_night * bookingDetails.days;
        setTotal(totalPrice);

        if (bookingDetails.arrivalTime) {
            setArrivalTime(bookingDetails.arrivalTime);
        }
        
        if (bookingDetails.fullGuestName) {
            setFullGuestName(bookingDetails.fullGuestName);
        }

        fetchUserDetails();
    }, [bookingDetails]);

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please log in to make a booking");
                navigate("/login");
                return;
            }
            
            const response = await fetch(baseUrl + "getUserDetails.php", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setUserDetails({
                    name: data.user.name || "",
                    email: data.user.email || "",
                    user_address: data.user.user_address || "",
                    phone_no: data.user.phone_no || "",
                    user_verification: data.user.user_verification || null
                });
                
                if (!fullGuestName) {
                    setFullGuestName(data.user.name || "");
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            toast.error("Failed to fetch user details");
        }
    };

    const handleInputChange = (e, field) => {
        setUserDetails({
            ...userDetails,
            [field]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setUserDetails({
            ...userDetails,
            user_verification: e.target.files[0]
        });
    };

    const handleNext = (e) => {
        e.preventDefault();
        
        if (!bookingDetails || !bookingDetails.property) {
            toast.error("Booking details not found");
            return;
        }
        
        if (!arrivalTime) {
            toast.error("Please select your arrival time");
            return;
        }
        
        setBookingDetails({
            ...bookingDetails,
            userDetails: userDetails,
            arrivalTime: arrivalTime,
            fullGuestName: fullGuestName || userDetails.name
        });

        const paymentDetails = {
            checkInDate: bookingDetails.checkInDate,
            checkOutDate: bookingDetails.checkOutDate,
            propertyId: bookingDetails.property.property_id,
            days: bookingDetails.days,
            userDetails: userDetails,
            arrivalTime: arrivalTime,
            fullGuestName: fullGuestName || userDetails.name
        };

        navigate("/User/Payment", { state: paymentDetails });
    };

    if (!bookingDetails || !bookingDetails.property) {
        return (
            <>
                <Navbar />
                <div className="no-booking-container">
                    <div className="error-message">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        <span>No booking details found. Please select a property first.</span>
                    </div>
                    <button 
                        className="back-button"
                        onClick={() => navigate("/")}>
                        Back to Properties
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="booking-container">
                <div className="booking-content">
                    <div>
                        <div className="booking-property-details">
                            <h2 className="property-title">{bookingDetails.property.property_name}</h2>
                            <div className="property-location">
                                {bookingDetails.property.location}
                            </div>
                        </div>

                        <div className="booking-card">
                            <h3>Your booking details</h3>
                            <div className="booking-dates">
                                <div>Check-in: {new Date(bookingDetails.checkInDate).toLocaleDateString()}</div>
                                <div>Check-out: {new Date(bookingDetails.checkOutDate).toLocaleDateString()}</div>
                                <div>Total length of stay: {bookingDetails.days} {bookingDetails.days === 1 ? 'night' : 'nights'}</div>
                            </div>
                        </div>

                        <div className="price-summary">
                            <h3>Your price summary</h3>
                            <div>Original price: NPR {bookingDetails.property.price_per_night}</div>
                            <div>Total: NPR {total}</div>
                            <div>Includes taxes and fees</div>
                        </div>

                        <form onSubmit={handleNext}>
                            <div className="details-section">
                                <h3>Enter your details</h3>
                                <div className="input-group">
                                    <label>Full Name <span className="required">*</span></label>
                                    <input 
                                        type="text" 
                                        value={userDetails.name} 
                                        onChange={(e) => handleInputChange(e, "name")} 
                                        required 
                                    />
                                </div>
                                
                                <div className="input-group">
                                    <label>Email address <span className="required">*</span></label>
                                    <input 
                                        type="email" 
                                        value={userDetails.email} 
                                        onChange={(e) => handleInputChange(e, "email")} 
                                        required 
                                    />
                                    <div className="input-hint">Confirmation email will be sent to this address</div>
                                </div>

                                <h3>Your address</h3>
                                <div className="input-group">
                                    <label>Address <span className="required">*</span></label>
                                    <input 
                                        type="text" 
                                        value={userDetails.user_address} 
                                        onChange={(e) => handleInputChange(e, "user_address")} 
                                        required 
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Image of License or Citizenship</label>
                                    <input 
                                        type="file" 
                                        onChange={handleFileChange} 
                                    />
                                    {userDetails.user_verification ? (
                                        <div className="verification-preview">
                                            <p>Verification already uploaded</p>
                                            <img 
                                                src={userDetails.user_verification} 
                                                alt="Verification" 
                                                style={{ maxWidth: '100px', height: 'auto' }}
                                            />
                                        </div>
                                    ) : (
                                        <p>No verification image available. Please upload a file.</p>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label>Phone number <span className="required">*</span></label>
                                    <input 
                                        type="tel" 
                                        value={userDetails.phone_no} 
                                        onChange={(e) => handleInputChange(e, "phone_no")} 
                                        required 
                                    />
                                    <div className="input-hint">Needed for property validation</div>
                                </div>
                            </div>

                            <div className="arrival-section">
                                <h3>Your arrival time</h3>
                                <div>You can check in between 2:00 PM and 12:00 AM</div>
                                
                                <div className="input-group">
                                    <label>Add your estimated arrival time <span className="required">*</span></label>
                                    <select 
                                        value={arrivalTime} 
                                        onChange={(e) => setArrivalTime(e.target.value)} 
                                        required
                                    >
                                        <option value="">Please select</option>
                                        <option value="14:00-15:00">2:00 PM - 3:00 PM</option>
                                        <option value="15:00-16:00">3:00 PM - 4:00 PM</option>
                                        <option value="16:00-17:00">4:00 PM - 5:00 PM</option>
                                        <option value="17:00-18:00">5:00 PM - 6:00 PM</option>
                                        <option value="18:00-19:00">6:00 PM - 7:00 PM</option>
                                        <option value="19:00-20:00">7:00 PM - 8:00 PM</option>
                                        <option value="21:00-22:00">9:00 PM - 10:00 PM</option>
                                        <option value="22:00-23:00">10:00 PM - 11:00 PM</option>
                                        <option value="23:00-00:00">11:00 PM - 12:00 AM</option>
                                    </select>
                                </div>
                            </div>

                            <div className="property-section">
                                <h3>{bookingDetails.property.property_name}</h3>
                                <div>Guests: {bookingDetails.property.max_guests || 6} adults</div>
                                
                                <div className="input-group">
                                    <label>Full Guest Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Full name of primary guest"
                                        value={fullGuestName}
                                        onChange={(e) => setFullGuestName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="vendor-info-section">
                                <h3>Vendor Information</h3>
                                <p><strong>Name:</strong> {bookingDetails.property.vendor_name}</p>
                                <p><strong>Phone:</strong> {bookingDetails.property.vendor_phone}</p>
                            </div>

                            <div className="action-button">
                                <Button label="Next: Final details" type="submit" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingConfirm;
