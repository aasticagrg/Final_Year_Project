import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser } from "react-icons/fi";  // FiUser for profile icon
import toast from "react-hot-toast";
import { baseUrl } from "../../constants";
import "./styles.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const isLoggedIn = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));

      const response = await fetch(baseUrl + "auth/logout.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        localStorage.clear();
        toast.success("Logged out successfully");
        navigate("/");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
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
        <Link className="link" to="/User/about" onClick={toggleMenu}>About</Link>
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
              {/* Profile Icon */}
              <button className="profile-icon" onClick={toggleDropdown}>
                <FiUser /> {/* Profile icon */}
              </button>

              {dropdownOpen && (
                <div className="dropdown">
                  <Link to="/User/profile">My Account</Link>
                  <Link to="/bookings">Booked</Link>
                  <Link to="/reviews">Reviews</Link>
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
