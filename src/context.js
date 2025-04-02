import { createContext, useState, useEffect } from "react";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [bookingDetails, setBookingDetails] = useState(() => {
        // Try to get booking details from localStorage on initial load
        const savedBookingDetails = localStorage.getItem("bookingDetails");
        return savedBookingDetails ? JSON.parse(savedBookingDetails) : null;
    });

    // Save booking details to localStorage whenever they change
    useEffect(() => {
        if (bookingDetails) {
            localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
        }
    }, [bookingDetails]);

    const clearBookingDetails = () => {
        localStorage.removeItem("bookingDetails");
        setBookingDetails(null);
    };

    return (
        <BookingContext.Provider value={{ bookingDetails, setBookingDetails, clearBookingDetails }}>
            {children}
        </BookingContext.Provider>
    );
};