import { useState, useEffect } from "react";
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  TextField,
  Modal,
  Typography,
  Button,
} from "@mui/material";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in as a vendor");
      setTimeout(() => navigate("/User/login"), 1000);
      return;
    }

    const vendor_id = localStorage.getItem("vendor_id");
    if (!vendor_id) {
      verifyToken(token);
    } else {
      fetchBookings(token);
    }
  }, [navigate, searchQuery]);

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${baseUrl}auth/verifyToken.php`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.data?.vendor_id) {
        localStorage.setItem("vendor_id", data.data.vendor_id);
        fetchBookings(token);
      } else {
        toast.error("Unauthorized access.");
        setTimeout(() => navigate("/User/login"), 1000);
      }
    } catch (err) {
      toast.error("Failed to verify token");
      setTimeout(() => navigate("/User/login"), 1000);
    }
  };

  const fetchBookings = async (token) => {
    try {
      const response = await fetch(`${baseUrl}getVendorBookings.php?search=${searchQuery}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.bookings)) {
        const bookingsWithId = data.bookings.map((booking) => ({
          ...booking,
          id: booking.booking_id,
        }));
        setBookings(bookingsWithId);
      } else {
        toast.error(data.message || "Failed to fetch bookings.");
      }
    } catch (error) {
      toast.error("Error fetching bookings.");
    }
  };

  const cancelBooking = async (booking_id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      const response = await fetch(`${baseUrl}cancelBookings.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ booking_id }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Booking cancelled successfully.");
        fetchBookings(localStorage.getItem("token")); // refresh
      } else {
        toast.error(data.message || "Failed to cancel booking.");
      }
    } catch (error) {
      toast.error("Error cancelling booking.");
    }
  };

  const columns = [
    { field: "booking_id", headerName: "Booking ID", width: 100 },
    { field: "property_name", headerName: "Property", width: 200 },
    { field: "check_in_date", headerName: "Check-In", width: 120 },
    { field: "check_out_date", headerName: "Check-Out", width: 120 },
    {
      field: "booking_status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Typography
          variant="body2"
          color={params.value === "cancelled" ? "error" : "primary"}
        >
          {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
        </Typography>
      ),
    },
    { field: "total_price", headerName: "Total Price", width: 120 },
    { field: "arrival_time", headerName: "Arrival", width: 120 },
    { field: "full_guest_name", headerName: "Guest Name", width: 150 },
    { field: "name", headerName: "User Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone_no", headerName: "Phone", width: 130 },
    { field: "user_address", headerName: "Address", width: 250 },
    {
      field: "user_verification",
      headerName: "Verification",
      width: 150,
      renderCell: (params) => {
        const imageUrl = params.value ? `${baseUrl}${params.value}` : null;
        return imageUrl ? (
          <img
            src={imageUrl}
            alt="Verification"
            style={{
              maxWidth: "100px",
              maxHeight: "60px",
              borderRadius: "4px",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => setSelectedImage(imageUrl)}
          />
        ) : (
          <span style={{ color: "gray" }}>No Image</span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        params.row.booking_status === "booked" ? (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => cancelBooking(params.row.booking_id)}
          >
            Cancel Booking
          </Button>
        ) : (
          <Typography variant="caption" color="textSecondary">
            No actions
          </Typography>
        )
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Manage Bookings
      </Typography>

      <TextField
        label="Search Bookings"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

      <div style={{ width: "100%", height: 600 }}>
        <DataGrid
          rows={bookings}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>

      {/* Modal for full-size image */}
      <Modal open={!!selectedImage} onClose={() => setSelectedImage(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            maxHeight: "80vh",
            maxWidth: "90vw",
            overflow: "auto",
            outline: "none",
          }}
        >
          <img
            src={selectedImage}
            alt="Full Verification"
            style={{ width: "100%", height: "auto", maxHeight: "80vh" }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ManageBookings;
