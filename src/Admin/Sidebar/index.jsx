import { IoMdHome } from "react-icons/io";
import { FaTable, FaUsers } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { useState, useEffect } from "react";

const AdminSidebar = ({ active, setActive }) => {
    const [isExpanded, setIsExpanded] = useState(window.innerWidth > 768);

    useEffect(() => {
        const handleResize = () => {
            setIsExpanded(window.innerWidth > 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const menuOptions = [
        { title: "Dashboard", icon: <IoMdHome />, link: "/Admin/Dashboard" },
        { title: "Users", icon: <FaUsers />, link: "/Admin/User" },
        { title: "Vendors", icon: <FaUsers />, link: "/Admin/Vendor" },
        { title: "Complaints", icon: <FaUsers />, link: "/Admin/Complaint" }
      
    ];

    return (
        <div
            style={{
                width: isExpanded ? "200px" : "50px", // Expand for desktop, collapse for mobile
                backgroundColor: "#5B99C2",
                minHeight: "calc(100vh - 50px)",
                transition: "width 0.3s ease",
                transform: "translateX(0)",
                padding: "10px", 
                // paddingTop: "60px"
            }}
        >
            {menuOptions.map((option, index) => {
                const isActive = active === index;
                return (
                    <button
                        key={index}
                        onClick={() => setActive(index)}
                        style={{
                            textDecoration: "none",
                            border: "none",
                            cursor: "pointer",
                            width: "100%",
                            color: isActive ? "black" : "white",
                            display: "flex",
                            backgroundColor: isActive ? "lightgray" : "transparent",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px",
                            fontSize: "18px",
                        }}
                    >
                        {option.icon}
                        <span style={{ display: isExpanded ? "block" : "none" }}>{option.title}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default AdminSidebar;