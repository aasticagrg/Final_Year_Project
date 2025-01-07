import React from 'react';
// import { Link } from "react-router-dom"
import "./styles.css"
import { FaRegHeart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";


const Navbar = () => {
  return (
    <div className="container" >

       <img src= '../assets/rentalLogo.png' alt= 'logo' style={{
        width : "max-width",
        height: "35px",
       }}/>

       <ul>
        <li>Home</li>
        <li>Booking</li>
        <li>About</li>
        <li>Contact</li>
        <li>List Your property</li>
       </ul>

       {/* <span className='nav-link'>
        <Link>Home</Link>
        <Link>About Us</Link>
        <Link>Services</Link>
       </span> */}

       <div className='icons'>
        <CgProfile />
       </div>

    </div>
  );
}

export default Navbar;