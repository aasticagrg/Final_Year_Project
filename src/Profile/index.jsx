import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { baseUrl } from "../constants";
import toast from "react-hot-toast";

const ProfilePage = () => {
    const [user, setUser] = useState(null);

    // Fetch user details from the server
    const getUserDetails = async () => {
        try {
            const response = await fetch(baseUrl + "getUserDetails.php?" + new URLSearchParams({
                token: localStorage.getItem("token")
            }));

            const data = await response.json();

            console.log("API Response:", data);  // Log the response to debug

            if (data.success) {
                setUser(data.user); // Set the user data in state
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error("Failed to get user details");
            console.error("Error fetching user details:", error);  // Log the actual error
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("You need to be logged in to view this page.");
        } else {
            getUserDetails();
        }
    }, []);

    return (
        <>
            <Navbar />
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <div style={{
                    position: "relative",
                    display: "flex",
                    width: "100%",
                    height: "200px",
                    border: "1px solid black"
                }}>
                    <img style={{
                        width: "100%",
                        position: "absolute",
                        height: "200px",
                        objectFit: "cover",
                    }} src="https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                    <div style={{
                        height: "150px",
                        width: "150px",
                        bottom: "-75px",
                        right: "calc(45%)",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        position: "absolute",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid black",
                    }}>
                        {
                            user?.full_name ? (
                                <span style={{
                                    fontSize: "50px"
                                }}>
                                    {user.full_name.slice(0, 2).toUpperCase()}
                                </span>
                            ) : null
                        }
                    </div>
                </div>

                <div style={{
                    maxWidth: "1000px",
                    paddingTop: "100px",
                    width: "100%"
                }}>
                    <span style={{
                        fontSize: "30px",
                        fontWeight: "bold"
                    }}>{"My Profile"}</span>

                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "20px"
                    }}>
                        {
                            user ? (
                                <>
                                    <span><strong>Full Name:</strong> {user.full_name}</span>
                                    <span><strong>Email:</strong> {user.email}</span>
                                    <span><strong>Phone:</strong> {user.phone}</span>
                                    <span><strong>Address:</strong> {user.address}</span>
                                </>
                            ) : (
                                <span>Loading...</span> // Display loading message until user data is fetched
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfilePage;
