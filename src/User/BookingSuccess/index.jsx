import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import "./style.css";

const BookingSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingId } = location.state || {};

    return (
        <>
            <Navbar />
            <div className="success-container">
                <div className="success-content">
                    <div className="success-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    
                    <h2>Booking Successful!</h2>
                    
                    
                    <p className="success-message">
                        Your booking has been successfully confirmed. You will receive a confirmation email shortly.
                    </p>
                    
                    <div className="info-box">
                        <h3>What's Next?</h3>
                        <ul>
                            <li>Check your email for booking details</li>
                            <li>Prepare for your trip</li>
                            <li>Contact the property if you have any questions</li>
                        </ul>
                    </div>
                    
                    <div className="action-buttons">
                        <Button 
                            label="View My Bookings" 
                            onClick={() => navigate("/User/Booked")}
                        />
                        <button 
                            className="secondary-button"
                            onClick={() => navigate("/")}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingSuccess;