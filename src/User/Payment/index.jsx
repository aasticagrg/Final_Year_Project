import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { BookingContext } from "../../context";
import { baseUrl } from "../../constants";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import KhaltiCheckout from "khalti-checkout-web";
import "./style.css";

const UserPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const paymentDetails = location.state;
    const { bookingDetails, clearBookingDetails } = useContext(BookingContext);
    const [total, setTotal] = useState(0);
    const [bookingId, setBookingId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("online"); // Default to online payment

    useEffect(() => {
        if (!bookingDetails || !bookingDetails.property) {
            if (!paymentDetails) {
                toast.error("Payment details not found");
                navigate("/User/BookingConfirm");
                return;
            }
        }

        const propertyPrice = bookingDetails?.property?.price_per_night || 0;
        const days = bookingDetails?.days || (paymentDetails?.days || 0);
        const totalPrice = propertyPrice * days;
        setTotal(totalPrice);
    }, [paymentDetails, bookingDetails, navigate]);

    const handleBookingCreation = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Token retrieved from localStorage:", token);
            if (!token) {
                toast.error("Please log in to complete your booking");
                navigate("/User/login");
                return;
            }

            const checkInDate = bookingDetails?.checkInDate || paymentDetails?.checkInDate;
            const checkOutDate = bookingDetails?.checkOutDate || paymentDetails?.checkOutDate;
            const propertyId = bookingDetails?.property?.property_id || paymentDetails?.propertyId;
            const days = bookingDetails?.days || paymentDetails?.days;
            const arrivalTime = bookingDetails?.arrivalTime || paymentDetails?.arrivalTime;
            const fullGuestName = bookingDetails?.fullGuestName || paymentDetails?.fullGuestName;

            if (!checkInDate || !checkOutDate || !propertyId || !days || !arrivalTime || !fullGuestName) {
                toast.error("Missing booking information. Please go back and try again.");
                navigate("/User/BookingConfirm");
                return;
            }

            // Prepare the data to be sent as JSON
            const requestData = {
                check_in_date: checkInDate,
                check_out_date: checkOutDate,
                property_id: propertyId,
                days: days,
                arrival_time: arrivalTime,
                full_guest_name: fullGuestName,
                token: token,
            };

            const response = await fetch(baseUrl + "booking.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Indicate we're sending JSON
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Booking created successfully");
                setBookingId(data.booking_id);
                // Handle payment logic here
            } else {
                toast.error(data.message || "Failed to create booking");
            }
        } catch (error) {
            console.error("Error creating booking:", error);
            toast.error("Something went wrong. Please try again later.");
        }
    };

    const makeKhaltiPayment = (bookingId) => {
        try {
            const config = {
                "publicKey": "test_public_key_1441eb69c03b4bcf8c06b61b48923809",
                "productIdentity": `Booking-${bookingId}`,
                "productName": `Property Booking #${bookingId}`,
                "productUrl": "http://localhost:3000/",
                "returnUrl": "http://localhost:3000/",
                "eventHandler": {
                    async onSuccess(payload) {
                        await completePayment(bookingId, payload, "online");
                    },
                    onError(error) {
                        toast.error("Payment failed");
                        console.error("Khalti payment error:", error);
                    },
                    onClose() {
                        toast.error("Payment window closed");
                    }
                },
                "paymentPreference": ["KHALTI"],
            };

            const checkout = new KhaltiCheckout(config);
            checkout.show({ amount: total * 100 });
        } catch (error) {
            console.error("Khalti payment error:", error);
            toast.error("Payment initialization failed");
        }
    };

    const makeOnPropertyPayment = async (bookingId) => {
        try {
            await completePayment(bookingId, { method: "on_property" }, "on_property");
        } catch (error) {
            console.error("Error processing on-property payment:", error);
            toast.error("Failed to process on-property payment");
        }
    };

    const completePayment = async (bookingId, payloadData, method) => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("token", token); // Send token in form data
            formData.append("amount", total);
            formData.append("bookingId", bookingId);
            formData.append("otherData", JSON.stringify(payloadData));
            formData.append("method", method);

            const response = await fetch(baseUrl + "makePayment.php", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message || "Payment successful");
                clearBookingDetails();
                navigate("/User/BookingSuccess", { state: { bookingId } });
            } else {
                toast.error(data.message || "Payment processing failed");
            }
        } catch (error) {
            console.error("Payment completion error:", error);
            toast.error("Failed to complete payment process");
        }
    };

    const hasValidData = Boolean(
        (bookingDetails && bookingDetails.property) || 
        (paymentDetails && paymentDetails.propertyId)
    );

    if (!hasValidData) {
        return (
            <>
                <Navbar />
                <div className="payment-error-container">
                    <div className="error-message">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        <span>Payment details not found. Please start again.</span>
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

    const propertyName = bookingDetails?.property?.property_name || "Your Booking";
    const propertyPrice = bookingDetails?.property?.price_per_night || 0;
    const checkInDate = bookingDetails?.checkInDate || paymentDetails?.checkInDate;
    const checkOutDate = bookingDetails?.checkOutDate || paymentDetails?.checkOutDate;
    const days = bookingDetails?.days || paymentDetails?.days || 0;
    const arrivalTime = bookingDetails?.arrivalTime || paymentDetails?.arrivalTime;
    const fullGuestName = bookingDetails?.fullGuestName || paymentDetails?.fullGuestName || "Guest";

    return (
        <>
            <Navbar />
            <div className="payment-container">
                <div className="payment-content">
                    <h2>Payment for {propertyName}</h2>

                    <div className="booking-summary">
                        <h3>Booking Summary</h3>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Check-in:</span>
                                <span>{checkInDate ? new Date(checkInDate).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="summary-row">
                                <span>Check-out:</span>
                                <span>{checkOutDate ? new Date(checkOutDate).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="summary-row">
                                <span>Guest:</span>
                                <span>{fullGuestName}</span>
                            </div>
                            <div className="summary-row">
                                <span>Length of stay:</span>
                                <span>{days} {days === 1 ? 'night' : 'nights'}</span>
                            </div>
                            <div className="summary-row">
                                <span>Arrival time:</span>
                                <span>{arrivalTime || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="price-breakdown">
                        <h3>Price Details</h3>
                        <div className="price-details">
                            <div className="price-row">
                                <span>Price per night:</span>
                                <span>NPR {propertyPrice}</span>
                            </div>
                            <div className="price-row">
                                <span>Number of nights:</span>
                                <span>{days}</span>
                            </div>
                            <div className="price-row total">
                                <span>Total amount:</span>
                                <span>NPR {total}</span>
                            </div>
                        </div>
                    </div>

                    <div className="payment-methods">
                        <h3>Choose Payment Method</h3>
                        <div className="payment-options">
                            <div 
                                className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod('online')}
                            >
                                <div className="option-radio">
                                    <div className={`radio-inner ${paymentMethod === 'online' ? 'selected' : ''}`}></div>
                                </div>
                                <span>Online Payment</span>
                            </div>
                            <div 
                                className={`payment-option ${paymentMethod === 'on_property' ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod('on_property')}
                            >
                                <div className="option-radio">
                                    <div className={`radio-inner ${paymentMethod === 'on_property' ? 'selected' : ''}`}></div>
                                </div>
                                <span>Pay on Property</span>
                            </div>
                        </div>
                    </div>

                    {paymentMethod === 'online' ? (
                        <Button
                            label="Proceed with Khalti Payment"
                            onClick={() => makeKhaltiPayment(bookingId)}
                        />
                    ) : (
                        <Button
                            label="Proceed with On-Property Payment"
                            onClick={() => makeOnPropertyPayment(bookingId)}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default UserPayment;
