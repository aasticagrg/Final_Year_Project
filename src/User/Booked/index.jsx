import React, { useEffect, useState } from "react";
import "./style.css";
import { baseUrl } from "../../constants";
import Navbar from "../../components/Navbar";

const BookedPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseUrl}getUserBookings.php`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.success) {
          setBookings(result.data);
        } else {
          console.error("Failed to fetch bookings");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <>
    <Navbar/>
    <div className="booked-page">
      <h1 className="booked-page-title">Your Bookings</h1>

      {bookings.length === 0 ? (
        <p className="no-bookings-msg">You have no bookings yet.</p>
      ) : (
        <div className="booking-grid">
          {bookings.map((booking) => (
            <div key={booking.booking_id} className="booking-card compact">
              <div className="booking-header">
                <h2 className="property-title">{booking.property_name}</h2>
                <p className="property-city">{booking.city}</p>
              </div>

              <div className="date-info compact">
                <p><span>Check-in:</span> {booking.check_in_date}</p>
                <p><span>Check-out:</span> {booking.check_out_date}</p>
              </div>

              <div className="status-section compact">
                <div className="status-group">
                  <p className="status-label">Booking:</p>
                  <span className={`status ${booking.booking_status ?? "unknown"}`}>
                    {booking.booking_status ?? "Unknown"}
                  </span>
                </div>
                <div className="status-group">
                  <p className="status-label">Payment:</p>
                  <span className={`status ${booking.payment_status ?? "not-paid"}`}>
                    {booking.payment_status ?? "Not Paid"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};
export default BookedPage;