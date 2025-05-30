import { useState } from "react";
import AdminSidebar from "../Sidebar";
import AdminDashboard from "../Dashboard";
import AdminUser from "../User";
import AdminVendor from "../Vendor";
import AdminComplaint from "../Complaint";
import AdminProperty from "../Property";
import AdminBookingPayments from "../Bookings";
import AdminReport from "../Report";


const AdminHome = () => {
    const [isExpanded, setIsExpanded] = useState(true); // default true so Home aligns
    const [active, setActive] = useState(0);

    const pages = [
        <AdminDashboard />,
        <AdminProperty />,
        <AdminUser />,
        <AdminVendor />,
        <AdminBookingPayments />,
        <AdminComplaint />,
        <AdminReport />,
        
    ];

    const sidebarWidth = isExpanded ? 200 : 60;

    return (
        <div style={{ display: "flex" }}>
            <AdminSidebar
                active={active}
                setActive={setActive}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
            />

            <div
                style={{
                    marginLeft: `${sidebarWidth}px`,
                    padding: "80px 30px",
                    width: "100%",
                    transition: "margin-left 0.3s ease",
                }}
            >
                {pages[active]}
            </div>
        </div>
    );
};

export default AdminHome;
