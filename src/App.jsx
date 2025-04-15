import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { BookingProvider } from "./context"; // Import your BookingProvider

import Home from "./User/Home";
import LoginPage from './User/Login';
import RegisterPage from './User/Register';
import PropertiesPage from "./User/PropertiesPage";
import VendorRegisterPage from "./Vendor/VendorRegister";
import Properties from "./User/Properties";
import AddProperty from "./Vendor/AddProperty";
import VendorHome from "./Vendor/Home";
import ProfilePage from "./User/Profile";
import Contact from "./User/Contact";
import PropertyDetails from "./User/PropertyDetail";
import BookingConfirm from "./User/BookingConfirm";
import UserPayment from "./User/Payment";
import BookingSuccess from "./User/BookingSuccess";

import ManageProperties from "./Vendor/Property";
import AdminHome from "./Admin/Home";
import AdminDashboard from "./Admin/Dashboard";
import AdminUser from "./Admin/User";
import AdminVendor from "./Admin/Vendor";
import AdminComplaint from "./Admin/Complaint";

function App() {
  const token = localStorage.getItem("token");
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/User/Login",
      element: <LoginPage />
    },
    {
      path: "/User/Register",
      element: <RegisterPage />
    },
    {
      path: "/User/PropertiesPage",
      element: <PropertiesPage />
    },
    {
      path: "/User/Properties",
      element: <Properties />
    },
    {
      path: "/User/PropertyDetails/:id",
      element: <PropertyDetails />
    },
    {
      path: "/User/Contact",
      element: <Contact />
    },
    {
      path: "/User/Profile",
      element: token ? <ProfilePage /> : <LoginPage />
    },
    {
      path: "/User/BookingConfirm",
      element: token ? <BookingConfirm /> : <LoginPage />
    },
    {
      path: "/User/Payment",
      element: token ? <UserPayment /> : <LoginPage />
    },
    {
      path: "/User/BookingSuccess",
      element: token ? <BookingSuccess /> : <LoginPage />
    },
    {
      path: "/Vendor/VendorRegister",
      element: <VendorRegisterPage />
    },
    {
      path: "/Vendor/Home",
      element: token ? <VendorHome /> : <LoginPage />
    },
    {
      path: "/Vendor/AddProperty",
      element: token ? <AddProperty /> : <LoginPage />
    },
    {
      path: "/Vendor/Property",
      element: token ? <ManageProperties /> : <LoginPage />
    },
    {
      path: "/Admin/Home",
      element: token ? <AdminHome /> : <LoginPage />
    },
    {
      path: "/Admin/User",
      element: token ? <AdminUser /> : <LoginPage />
    },
    {
      path: "/Admin/Dashboard",
      element: token ? <AdminDashboard /> : <LoginPage />
    },
    {
      path: "/Admin/Vendor",
      element: token ? <AdminVendor /> : <LoginPage />
    },
    {
      path: "/Admin/Complaint",
      element: token ? <AdminComplaint /> : <LoginPage />
    },
    {
      path: "*",
      element: <div>Page Not Found!!!</div>
    }
  ]);
  

  return (
    <BookingProvider> {/* Wrap your app with BookingProvider */}
      <Toaster />
      <RouterProvider router={router} />
    </BookingProvider>
  );
}

export default App;