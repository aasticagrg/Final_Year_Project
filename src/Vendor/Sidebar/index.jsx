import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { FaTable, FaCalendarCheck } from "react-icons/fa";
import { MdPayments, MdHomeWork } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import onLogout from "../../components/Logout"; 
import { MdOutlineRateReview } from "react-icons/md";
import { GoGraph } from "react-icons/go";
import { baseUrl } from "../../constants";

const VendorSidebar = ({ isExpanded, setIsExpanded, setActive, active }) => {
    const [vendor, setVendor] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${baseUrl}getVendorDetails.php`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) setVendor(data.vendor);
            })
            .catch(err => console.error("Error fetching vendor details:", err));
    }, []);

    const menuOptions = [
        { title: "Dashboard", icon: <IoMdHome /> },
        { title: "List Property", icon: <FaTable /> },
        { title: "Property", icon: <MdHomeWork /> },
        { title: "Booking", icon: <FaCalendarCheck /> },
        { title: "Payments", icon: <MdPayments /> },
        { title: "Reviews", icon: <MdOutlineRateReview /> },
        { title: "Revenue", icon: <GoGraph /> },
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
                backgroundColor: "#2C3E50",
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
                overflowY: "auto", // Add scrolling if needed
                height: "100vh", // Ensure it takes full height
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
                            marginBottom: "10px",
                        }}
                    >
                        EasyRental Vendor Hub
                    </div>
                )}

                {/* Vendor Name (Set Active to Profile Page) */}
                <div
                    onClick={() => setActive(7)} // Set active to the Profile Page (index 5)
                    style={{
                        cursor: "pointer",
                        backgroundColor: "#34495E",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        marginBottom: "15px",
                        fontSize: isExpanded ? "16px" : "14px",
                        textAlign: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                    title={vendor?.vendor_name || "Vendor"}
                >
                    {isExpanded
                        ? vendor?.vendor_name || "Loading..."
                        : vendor?.vendor_name?.charAt(0) || "?"}
                </div>

                <div
                    style={{
                        height: "1px",
                        backgroundColor: "#BDC3C7",
                        margin: "10px 0",
                    }}
                />
            </div>

            {/* Menu Options */}
            <div style={{ flexGrow: 0 }}>  {/* Changed from flexGrow: 1 to stop excessive stretching */}
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
                                backgroundColor: isActive ? "#A9C6E7" : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: isExpanded ? "flex-start" : "center",
                                gap: "10px",
                                padding: "10px",
                                margin: "5px 0", // Reduced margin from 8px to 5px
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
            </div>

            {/* Logout and Collapse Buttons in a container with auto margin top */}
            <div style={{ marginTop: "auto", paddingTop: "10px" }}>
                {/* Logout Button */}
                <button
                    onClick={() => onLogout(navigate)}
                    style={{
                        ...fontStyle,
                        backgroundColor: "#2C6B5B",
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
                        marginBottom: "10px",
                    }}
                >
                    <FiLogOut />
                    {isExpanded && <span>Logout</span>}
                </button>

                {/* Expand/Collapse Button */}
                <button
                    onClick={() => setIsExpanded(prev => !prev)}
                    style={{
                        ...fontStyle,
                        backgroundColor: "#344087",
                        color: "white",
                        border: "none",
                        width: "100%",
                        padding: "10px",
                        cursor: "pointer",
                        borderRadius: "5px",
                        marginBottom: "10px", // Added margin to ensure it's not right at the bottom
                    }}
                >
                    {isExpanded ? "Collapse" : "Expand"}
                </button>
            </div>
        </div>
    );
};

export default VendorSidebar;