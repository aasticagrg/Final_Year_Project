import { useState } from "react";
import Navbar from "../../components/Navbar";
import VendorSidebar from "../Sidebar";
import VendorBooking from "../Booking";
import ManageProperties from "../Property";


import AddProperty from "../AddProperty";
import VendorDashboard from "../Dashboard";


const VendorHome = () => {
    const [isExpanded, setIsExpanded] = useState(false)
    const pages = [
        <VendorDashboard/>,
        <AddProperty />,
        <ManageProperties/>,
        <VendorBooking />,
        
    ];


    const [active, setActive] = useState(0)
    return (<>
        <div>
            <div style={{
                position: "fixed",
                width: "100%",
                zIndex: "100",
            }}>
                <Navbar showMenu={true} onMenuClick={() => setIsExpanded(!isExpanded)} />
            </div>
            <div style={{
                display: "flex",
                paddingTop: "50px",
                overflow: "hidden",
            }}>
                <VendorSidebar active={active} setActive={setActive} isExpanded={isExpanded} />
                {
                    <div style={{
                        padding: "20px",
                        overflowY: "hidden",
                    }}>

                        {pages[active]}
                    </div>
                }
            </div>
        </div>

    </>);
}

export default VendorHome;