import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./styles.css";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="nav-container">
      <img 
        src='../assets/rentalLogo.png' 
        alt='logo' 
        style={{ width: "max-width", height: "35px" }}
      />

      <span className='nav-link'>
        <Link className="link" to="/home">Home</Link>
        <Link className="link">Booking</Link>
        <Link className="link">About</Link>
        <Link className="link">Contact</Link>
        <Link className="link" to="/VendorRegister">List Your Property</Link>
      

      <div className='icons' onClick={handleProfileClick}>
        <CgProfile />
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
      </span>
    </div>
  );
}

export default Navbar;
