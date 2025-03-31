import { useState } from "react";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../Sidebar";
import AdminDashboard from "../Dashboard";
import AdminUser from "../User";
import AdminVendor from "../Vendor";
import AdminComplaint from "../Complaint";



const AdminHome = () => {
    const [isExpanded, setIsExpanded] = useState(false)
    const pages = [
        <AdminDashboard/>,
        <AdminUser/>,
        <AdminVendor/>,
        <AdminComplaint/>,
        
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
                <AdminSidebar active={active} setActive={setActive} isExpanded={isExpanded} />
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

export default AdminHome;