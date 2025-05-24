import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import onLogout from "../../components/Logout";  // Import default
import "./styles.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const isLoggedIn = localStorage.getItem("token");

  const handleLogout = () => {
    onLogout(navigate);  // Pass navigate here
  };

  return (
    <nav className="nav-container">
      <img src="/assets/rentalLogo.png" alt="logo" className="logo" />

      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <FiX className="menu-icon" /> : <FiMenu className="menu-icon" />}
      </div>

      <div className={`nav-link ${menuOpen ? "nav-active" : ""}`}>
        <Link className="link" to="/" onClick={toggleMenu}>Home</Link>
        <Link className="link" to="/User/Properties" onClick={toggleMenu}>Property</Link>
        <Link className="link" to="/User/AboutUs" onClick={toggleMenu}>About</Link>
        <Link className="link" to="/User/Contact" onClick={toggleMenu}>Contact</Link>
        <Link className="link" to="/Vendor/VendorRegister" onClick={toggleMenu}>List Your Property</Link>

        <div className="auth-section">
          {!isLoggedIn ? (
            <>
              <button className="auth-button" onClick={() => navigate("/User/login")}>Login</button>
              <button className="auth-button" onClick={() => navigate("/User/register")}>Sign Up</button>
            </>
          ) : (
            <div className="user-dropdown">
              <button className="profile-icon" onClick={toggleDropdown}>
                <FiUser /> {/* Profile icon */}
              </button>

              {dropdownOpen && (
                <div className="dropdown">
                  <Link to="/User/profile">My Account</Link>
                  <Link to="/User/Booked">Booked</Link>
                  <Link to="/User/Reviews">Reviews</Link>
                  <Link to="/User/Liked">Liked</Link>
                  <Link to="#" onClick={handleLogout}>Sign Out</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
