// src/components/Navbar.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FiMenu, FiX } from "react-icons/fi"; // Import menu icons
import toast from "react-hot-toast"; // For toast notifications
import { baseUrl } from "../../constants"; // Adjust based on where your base URL is
import "./styles.css"; // Import CSS

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const onLogout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // If not logged in, show a toast and redirect to the login page
      toast.error("You are not logged in.");
      navigate("/login"); // Redirect to login page
      return;
    }

    try {
      const formData = new FormData();
      formData.append("token", token);

      const response = await fetch(baseUrl + "auth/logout.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        // Clear the token and navigate to the homepage
        localStorage.clear();
        navigate("/"); // Redirect to the homepage
        toast.success("Logged out successfully");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const isLoggedIn = localStorage.getItem("token"); // Check if the user is logged in

  const handleRestrictedLinkClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault(); // Prevent navigation
      toast.error("You need to be logged in to access this page.");
      navigate("/login"); // Redirect to login page
    }
  };

  return (
    <nav className="nav-container">
      {/* Logo */}
      <img src="../assets/rentalLogo.png" alt="logo" className="logo" />

      {/* Hamburger Menu Button */}
      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <FiX className="menu-icon" /> : <FiMenu className="menu-icon" />}
      </div>

      {/* Navbar Links */}
      <div className={`nav-link ${menuOpen ? "nav-active" : ""}`}>
        <Link className="link" to="/" onClick={toggleMenu}>Home</Link>
        <Link className="link" to="/properties" onClick={handleRestrictedLinkClick}>Booking</Link>
        <Link className="link" to="/about" onClick={toggleMenu}>About</Link>
        <Link className="link" to="/contact" onClick={toggleMenu}>Contact</Link>
        <Link className="link" to="/VendorRegister" onClick={toggleMenu}>List Your Property</Link>

        {/* Profile Icon & Dropdown */}
        <div className="icons" onClick={handleProfileClick}>
          <CgProfile className="profile-icon" />
          {dropdownOpen && (
            <div className="dropdown">
              <Link to="/profile" onClick={handleRestrictedLinkClick}>My Account</Link>
              <Link to="/bookings" onClick={handleRestrictedLinkClick}>Bookings</Link>
              <Link to="/reviews" onClick={handleRestrictedLinkClick}>Reviews</Link>
              <Link to="/liked" onClick={handleRestrictedLinkClick}>Liked</Link>
              <Link to="#" onClick={onLogout}>Sign Out</Link> {/* Trigger logout on click */}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
