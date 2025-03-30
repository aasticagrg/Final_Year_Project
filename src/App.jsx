import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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
      path: "*",
      element: <div>Page Not Found!!!</div>
    }
  ]);

  return (
    <>
      <Toaster />
      <RouterProvider router={router}/>
    </>
  );
}

export default App;
