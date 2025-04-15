import { useState } from "react";
import VendorSidebar from "../Sidebar";

import ManageProperties from "../Property";
import VendorPayments from "../Payment";
import AddProperty from "../AddProperty";
import VendorDashboard from "../Dashboard";
import ManageBookings from "../Booking";

const VendorHome = () => {
    const [isExpanded, setIsExpanded] = useState(true); // Default to expanded
    const [active, setActive] = useState(0);

    // Page components
    const pages = [
        <VendorDashboard />,
        <AddProperty />,
        <ManageProperties />,
        <ManageBookings />,
        <VendorPayments />
    ];

    const sidebarWidth = isExpanded ? 200 : 60; // Sidebar width based on isExpanded state

    return (
        <>
            <div style={{ display: "flex"}}>
                {/* Vendor Sidebar */}
                <VendorSidebar active={active} setActive={setActive} isExpanded={isExpanded} />

                {/* Main Content */}
                <div
                    style={{
                        marginLeft: `${sidebarWidth}px`, // Adjust content margin according to sidebar width
                        padding: "80px 30px", // Padding for the content area
                        width: "100%",
                        transition: "margin-left 0.3s ease", // Smooth transition for margin changes
                    }}
                >
                    {pages[active]} {/* Render the active page */}
                </div>
            </div>
        </>
    );
};

export default VendorHome;
