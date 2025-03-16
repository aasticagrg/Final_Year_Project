import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from './Home';
import LoginPage from './Login';
import RegisterPage from './Register';
import VendorRegisterPage from './VendorRegister';

import AddProperty from "./Vendor/AddProperty";
import VendorHome from "./Vendor/Home";


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
      path: "/VendorRegister",
      element: <VendorRegisterPage/>
    },
    {
      path: "/Register",
      element: <RegisterPage/>
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
