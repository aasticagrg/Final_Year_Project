
import toast from "react-hot-toast";
import { baseUrl } from "../../constants";


const onLogout = async (navigate) => {  // Accept navigate as an argument
  const confirmed = window.confirm("Do you really want to log out?");
  if (!confirmed) return;

  const token = localStorage.getItem("token");

  if (!token) {
    // If no token, just redirect to the login page
    navigate("/User/login");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("token", token);

    const response = await fetch(baseUrl + "auth/logout.php", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      localStorage.clear();  // Clear all localStorage data on successful logout
      navigate("/");  // Navigate to home page
      toast.success("Logged out successfully");
    } else {
      throw new Error("Logout failed");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};

export default onLogout;
