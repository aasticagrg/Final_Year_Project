import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { baseUrl } from "../../constants";

const VendorReviews = () => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(`${baseUrl}getVendorReviews.php`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
  
      if (data.success) {
        const withIds = data.reviews.map((review) => ({
          ...review,
          id: review.review_id,
        }));
        setReviews(withIds);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${baseUrl}deleteReview.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ review_id: reviewId }),
      });

      const result = await response.json();
      if (result.success) {
        fetchReviews(); // Refresh the list
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const columns = [
    { field: "review_id", headerName: "ID", width: 80 },
    { field: "user_name", headerName: "User", width: 150 },
    { field: "rating", headerName: "Rating", width: 100 },
    { field: "review_text", headerName: "Comment", width: 300 },
    { field: "created_at", headerName: "Date", width: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleDelete(params.row.review_id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <h2>Manage Reviews</h2>
      <DataGrid
        rows={reviews}
        columns={columns}
        getRowId={(row) => row.review_id}
        disableSelectionOnClick
      />
    </div>
  );
};

export default VendorReviews;
