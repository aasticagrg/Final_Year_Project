import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import "./styles.css"; // Import CSS

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="nav-container">
      {/* Logo */}
      <img 
        src='../assets/rentalLogo.png' 
        alt='logo' 
        className="logo"
      />

      {/* Navbar Links */}
      <div className="nav-link">
        <Link className="link" to="/home">Home</Link>
        <Link className="link" to="/booking">Booking</Link>
        <Link className="link" to="/about">About</Link>
        <Link className="link" to="/contact">Contact</Link>
        <Link className="link" to="/VendorRegister">List Your Property</Link>

        {/* Profile Icon & Dropdown */}
        <div className="icons" onClick={handleProfileClick}>
          <CgProfile className="profile-icon" />
          {dropdownOpen && (
            <div className="dropdown">
              <Link to="/profile">My Account</Link>
              <Link to="/bookings">Bookings</Link>
              <Link to="/reviews">Reviews</Link>
              <Link to="/liked">Liked</Link>
              <Link to="/signout">Sign Out</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
