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
      element: <Home/>
    },
    {
      path: "/User/Login",
      element: <LoginPage/>
    },
    {
      path: "/User/Profile",
      element: <ProfilePage/>
    },
    {
      path: "/User/Contact",
      element: <Contact/>
    },
    {
      path: "/User/PropertyDetails/:id",
      element: <PropertyDetails/>
    },
    {
      path: "/User/BookingConfirm",
      element: <BookingConfirm/>
    },
    {
      path: "/Vendor/VendorRegister",
      element: <VendorRegisterPage/>
    },
    {
      path: "/User/Register",
      element: <RegisterPage/>
    },
    {
      path: "/User/PropertiesPage",
      element: <PropertiesPage/>
    },
    {
      path: "/Vendor/AddProperty",
      element: <AddProperty/>
    },
    {
      path: "/Vendor/Home",
      element: <VendorHome/>
    },
    {
      path: "/User/Properties",
      element: <Properties/>
    },
    {
      path: "/Vendor/Property",
      element: <ManageProperties/>
    },
    {
      path: "/Admin/Home",
      element: <AdminHome/>
    },
    {
      path: "/Admin/User",
      element: <AdminUser/>
    },
    {
      path: "/Admin/Dashboard",
      element: <AdminDashboard/>
    },
    {
      path: "/Admin/Vendor",
      element: <AdminVendor/>
    },
    {
      path: "/Admin/Complaint",
      element: <AdminComplaint/>
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