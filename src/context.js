// BookingContext.js
import { createContext, useState } from "react";

export const BookingContext = createContext({
  bookingDetails: {},
  setBookingDetails: () => {},
});

export const BookingProvider = ({ children }) => {
  const [bookingDetails, setBookingDetails] = useState({});

  return (
    <BookingContext.Provider value={{ bookingDetails, setBookingDetails }}>
      {children}
    </BookingContext.Provider>
  );
};