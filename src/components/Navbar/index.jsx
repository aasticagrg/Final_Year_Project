import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FiMenu, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { baseUrl } from "../../constants";
import "./styles.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = (e) => {
    const isLoggedIn = localStorage.getItem("token");

    if (!isLoggedIn) {
      e.preventDefault();
      toast.error("You need to be logged in to access your profile.");
      navigate("/User/login");
    } else {
      setDropdownOpen(!dropdownOpen);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const onLogout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You are not logged in.");
      navigate("/User/login");
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
        localStorage.clear();
        navigate("/");
        toast.success("Logged out successfully");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const isLoggedIn = localStorage.getItem("token");

  return (
    <nav className="nav-container">
      <img src="../assets/rentalLogo.png" alt="logo" className="logo" />

      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <FiX className="menu-icon" /> : <FiMenu className="menu-icon" />}
      </div>

      <div className={`nav-link ${menuOpen ? "nav-active" : ""}`}>
        <Link className="link" to="/" onClick={toggleMenu}>Home</Link>
        <Link className="link" to="/User/Properties" onClick={toggleMenu}>Property</Link>
        <Link className="link" to="/User/about" onClick={toggleMenu}>About</Link>
        <Link className="link" to="/User/Contact" onClick={toggleMenu}>Contact</Link>
        <Link className="link" to="/Vendor/VendorRegister" onClick={toggleMenu}>List Your Property</Link>

        <div className="icons" onClick={handleProfileClick}>
          <CgProfile className="profile-icon" />
          {isLoggedIn && dropdownOpen && (
            <div className="dropdown">
              <Link to="/User/profile">My Account</Link>
              <Link to="/bookings">Booked</Link>
              <Link to="/reviews">Reviews</Link>
              <Link to="/liked">Liked</Link>
              <Link to="#" onClick={onLogout}>Sign Out</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;