
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from './Home';
import Login from './Login';
import Register from './Register';



function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element: <Login/>
    },
    {
      path:"/Home",
      element: <Home/>
    },
    {
      path:"/Register",
      element: <Register/>
    },
    {
      path:"*",
      element: <div>Page Not Found!!!</div>
    }
  ])
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
