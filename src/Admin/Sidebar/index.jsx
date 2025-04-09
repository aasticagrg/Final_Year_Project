
import { useState, useEffect } from "react";
import { IoNewspaper, IoHome } from "react-icons/io5";
import { IoIosPeople } from "react-icons/io";
import { FaPeopleCarryBox } from "react-icons/fa6";

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
        { title: "Dashboard", icon: <IoHome />, link: "/Admin/Dashboard" },
        { title: "Users", icon: <IoIosPeople />, link: "/Admin/User" },
        { title: "Vendors", icon: <FaPeopleCarryBox />, link: "/Admin/Vendor" },
        { title: "Complaints", icon: <IoNewspaper />, link: "/Admin/Complaint" }
      
    ];

    return (
        <div
            style={{
                width: isExpanded ? "200px" : "50px", // Expand for desktop, collapse for mobile
                backgroundColor: "#1B1B1B",
                minHeight: "calc(100vh - 50px)",
                transition: "width 0.3s ease",
                transform: "translateX(0)",
                padding: "10px", 
                fontWeight: "400"
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
                            gap: "20px",
                            padding: "20px",
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