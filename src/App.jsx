import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { BookingProvider } from "./context";

// User
import Home from "./User/Home";
import LoginPage from "./User/Login";
import RegisterPage from "./User/Register";
import Properties from "./User/Properties";
import PropertyDetails from "./User/PropertyDetail";
import Liked from "./User/Liked";
import BookedPage from "./User/Booked";
import UserReviewPage from "./User/Reviews";
import Contact from "./User/Contact";
import ProfilePage from "./User/Profile";
import BookingConfirm from "./User/BookingConfirm";
import UserPayment from "./User/Payment";
import BookingSuccess from "./User/BookingSuccess";

// Vendor
import VendorRegisterPage from "./Vendor/VendorRegister";
import VendorHome from "./Vendor/Home";
import ManageProperties from "./Vendor/Property";
import ManageBookings from "./Vendor/Booking";
import VendorDashboard from "./Vendor/Dashboard";
import VendorPayments from "./Vendor/Payment";
import VendorProfilePage from "./Vendor/Profile";
import VendorReviews from "./Vendor/Review";
import VendorRevenuePage from "./Vendor/Revenue";

// Admin
import AdminHome from "./Admin/Home";
import AdminDashboard from "./Admin/Dashboard";
import AdminUser from "./Admin/User";
import AdminVendor from "./Admin/Vendor";
import AdminComplaint from "./Admin/Complaint";

function App() {
    const token = localStorage.getItem("token");

    return (
        <BookingProvider>
            <Toaster />
            <Router>
                <Routes>
                    {/* Public/User routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/User/Login" element={<LoginPage />} />
                    <Route path="/User/Register" element={<RegisterPage />} />
                    <Route path="/User/Properties" element={<Properties />} />
                    <Route path="/User/PropertyDetails/:id" element={<PropertyDetails />} />
                    <Route path="/User/Contact" element={<Contact />} />
                    <Route path="/User/Profile" element={ <ProfilePage /> } />
                    <Route path="/User/BookingConfirm" element={ <BookingConfirm />}/>
                    <Route path="/User/Payment" element={ <UserPayment /> } />
                    <Route path="/User/BookingSuccess" element={ <BookingSuccess /> } />
                    <Route path="/User/Liked" element={<Liked />} />
                    <Route path="/User/Booked" element={ <BookedPage />} />
                    <Route path="/User/Reviews" element={<UserReviewPage />} />

                    {/* Vendor */}
                    <Route path="/Vendor/VendorRegister" element={<VendorRegisterPage />} />
                    <Route path="/Vendor/Home" element={token ? <VendorHome /> : <LoginPage />} />
                    <Route path="/Vendor/Property" element={token ? <ManageProperties /> : <LoginPage/>} />
                    <Route path="/Vendor/Booking" element={token ? <ManageBookings /> : <LoginPage />} />
                    <Route path="/Vendor/Dashboard" element={token ? <VendorDashboard /> : <LoginPage />} />
                    <Route path="/Vendor/Payment" element={token ? <VendorPayments /> : <LoginPage />} />
                    <Route path="/Vendor/Profile" element={token ? <VendorProfilePage /> : <LoginPage />} />
                    <Route path="/Vendor/Review" element={token ? <VendorReviews /> : <LoginPage />} />
                    <Route path="/Vendor/Revenue" element={token ? <VendorRevenuePage /> : <LoginPage />} />

                    {/* Admin */}
                    <Route path="/Admin/Home" element={token ? <AdminHome /> : <LoginPage />} />
                    <Route path="/Admin/Dashboard" element={token ? <AdminDashboard /> : <LoginPage />} />
                    <Route path="/Admin/User" element={token ? <AdminUser /> : <LoginPage />} />
                    <Route path="/Admin/Vendor" element={token ? <AdminVendor /> : <LoginPage />} />
                    <Route path="/Admin/Complaint" element={token ? <AdminComplaint /> : <LoginPage />} />

                    {/* Fallback */}
                    <Route path="*" element={<div>Page Not Found</div>} />
                </Routes>
            </Router>
        </BookingProvider>
    );
}

export default App;
