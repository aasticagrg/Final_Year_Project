import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import all your pages
import Home from './Home';
import LoginPage from './Login';
import RegisterPage from './Register';
import PropertiesPage from "./PropertiesPage";
import VendorRegisterPage from "./Vendor/VendorRegister";
import Properties from "./Properties";
import AddProperty from "./Vendor/AddProperty";
import VendorHome from "./Vendor/Home";
import ProfilePage from "./Profile";
import Contact from "./Contact";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  return token ? (
    children
  ) : (
    <Navigate to="/Login" replace state={{ from: window.location.pathname }} />
  );
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/Contact",
      element: <Contact />
    },
    {
      path: "/PropertiesPage",
      element: <PropertiesPage />
    },
    {
      path: "/Properties",
      element: <Properties />
    },
    {
      path: "/Vendor/VendorRegister",
      element: <VendorRegisterPage />
    },
    {
      // Protected Routes
      path: "/Profile",
      element: (
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      )
    },
    {
      path: "/Vendor/AddProperty",
      element: (
        <ProtectedRoute>
          <AddProperty />
        </ProtectedRoute>
      )
    },
    {
      path: "/Vendor/Home",
      element: (
        <ProtectedRoute>
          <VendorHome />
        </ProtectedRoute>
      )
    },
    {
      // Non-Layout Routes
      path: "/Login",
      element: <LoginPage />
    },
    {
      path: "/Register",
      element: <RegisterPage />
    },
    {
      path: "*",
      element: <div>Page Not Found!!!</div>
    }
  ]);

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;