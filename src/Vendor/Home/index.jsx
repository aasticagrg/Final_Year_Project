import { useState } from "react";
import VendorSidebar from "../Sidebar";
import ManageProperties from "../Property";
import VendorPayments from "../Payment";
import AddProperty from "../AddProperty";
import VendorDashboard from "../Dashboard";
import ManageBookings from "../Booking";
import VendorProfilePage from "../Profile";
import VendorReviews from "../Review";
import VendorRevenuePage from "../Revenue";

const VendorHome = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [active, setActive] = useState(0);

    // Define pages, including VendorProfilePage
    const pages = [
        <VendorDashboard />,
        <AddProperty />,
        <ManageProperties />,
        <ManageBookings />,
        <VendorPayments />,
        <VendorReviews/>,
        <VendorRevenuePage/>,
        <VendorProfilePage />// Vendor Profile page at index 7
        
    ];

    const sidebarWidth = isExpanded ? 200 : 60;

    return (
        <div style={{ display: "flex" }}>
            <VendorSidebar
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
                {/* Render the active page */}
                {pages[active]}
            </div>
        </div>
    );
};

export default VendorHome;
