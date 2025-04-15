
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";

export const onLogout = async (navigate) => {
  const token = localStorage.getItem("token");

  if (!token) {
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
      localStorage.clear();
      navigate("/");
      toast.success("Logged out successfully");
    } else {
      throw new Error("Logout failed");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};
