import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from './Home';
import LoginPage from './Login';
import RegisterPage from './Register';
import PropertiesPage from "./PropertiesPage";
import VendorRegisterPage from './VendorRegister';
import Properties from "./Properties";
import AddProperty from "./Vendor/AddProperty";
import VendorHome from "./Vendor/Home";
import ProfilePage from "./Profile";


function App() {
  const token = localStorage.getItem("token");
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>
    },
    {
      path: "/Login",
      element: <LoginPage/>
    },
    {
      path: "/Profile",
      element: <ProfilePage/>
    },
    {
      path: "/VendorRegister",
      element: <VendorRegisterPage/>
    },
    {
      path: "/Register",
      element: <RegisterPage/>
    },
    {
      path: "/PropertiesPage",
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
      path: "/Properties",
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
