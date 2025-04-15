import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoMdHome } from "react-icons/io";
import { FaTable, FaUsers } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { onLogout } from "../../components/Logout"; // adjust path as needed

const VendorSidebar = ({ active, setActive, isExpanded, setIsExpanded }) => {
    const navigate = useNavigate();

    const menuOptions = [
        { title: "Dashboard", icon: <IoMdHome />, link: "/Vendor/Dashboard" },
        { title: "List Property", icon: <FaTable />, link: "/Vendor/AddProperty" },
        { title: "Property", icon: <FaUsers />, link: "/Vendor/Property" },
        { title: "Booking", icon: <FaUsers />, link: "/Vendor/Booking" },
        { title: "Payments", icon: <MdPayments />, link: "/Vendor/Payment" },
    ];

    const sidebarWidth = isExpanded ? "200px" : "60px";

    const fontStyle = {
        fontFamily: "Montserrat, sans-serif",
        fontStyle: "normal",
        fontWeight: 500,
    };

    return (
        <div
            style={{
                ...fontStyle,
                width: sidebarWidth,
                backgroundColor: "#2C3E50",  // Charcoal blue-gray
                minHeight: "100vh",
                transition: "width 0.3s ease",
                padding: "10px 5px",
                color: "white",
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 100,
            }}
        >
            {/* Header */}
            <div style={{ textAlign: "center" }}>
                {isExpanded && (
                    <div
                        style={{
                            ...fontStyle,
                            fontWeight: "500",
                            fontSize: "20px",
                            marginBottom: "20px",
                        }}
                    >
                        EasyRent Vendor Hub
                    </div>
                )}
                <div
                    style={{
                        height: "1px",
                        backgroundColor: "#BDC3C7",  // Light gray separator
                        margin: "10px 0",
                    }}
                />
            </div>

            {/* Menu Options */}
            <div style={{ flexGrow: 0 }}>
                {menuOptions.map((option, index) => {
                    const isActive = active === index;
                    return (
                        <button
                            key={index}
                            onClick={() => setActive(index)}
                            style={{
                                ...fontStyle,
                                border: "none",
                                cursor: "pointer",
                                width: "100%",
                                color: isActive ? "#2C3E50" : "white",
                                backgroundColor: isActive ? "#A9C6E7" : "transparent",  // Highlight active item
                                display: "flex",
                                alignItems: "center",
                                justifyContent: isExpanded ? "flex-start" : "center",
                                gap: "10px",
                                padding: "10px",
                                margin: "8px 0",
                                fontSize: "16px",
                                borderRadius: "5px",
                                transition: "background-color 0.3s ease",
                            }}
                        >
                            {option.icon}
                            {isExpanded && <span>{option.title}</span>}
                        </button>
                    );
                })}

                {/* Logout Button */}
                <button
                    onClick={() => onLogout(navigate)}
                    style={{
                        ...fontStyle,
                        backgroundColor: "#2C6B5B",  // Dark green for logout button
                        color: "white",
                        border: "none",
                        padding: "10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isExpanded ? "flex-start" : "center",
                        gap: "10px",
                        fontSize: "16px",
                        width: "100%",
                        marginTop: "10px",
                    }}
                >
                    <FiLogOut />
                    {isExpanded && <span>Logout</span>}
                </button>
            </div>

            {/* Spacer to push collapse button to bottom */}
            <div style={{ flexGrow: 1 }} />

            {/* Collapse/Expand Button */}
            <div style={{ marginTop: "10px" }}>
                <button
                    onClick={() => setIsExpanded(prev => !prev)}
                    style={{
                        ...fontStyle,
                        backgroundColor: "#344087",  // Darker blue for collapse/expand button
                        color: "white",
                        border: "none",
                        width: "100%",
                        padding: "10px",
                        cursor: "pointer",
                        borderRadius: "5px",
                    }}
                >
                    {isExpanded ? "Collapse" : "Expand"}
                </button>
            </div>
        </div>
    );
};

export default VendorSidebar;
