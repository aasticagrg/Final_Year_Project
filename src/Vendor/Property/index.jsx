import { useState, useEffect } from "react";
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [editedRow, setEditedRow] = useState(null); // Track edited row for saving
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
      getProperties(token, vendor_id);
    }
  }, [navigate]);

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${baseUrl}auth/verifyToken.php`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.data && data.data.vendor_id) {
        localStorage.setItem("vendor_id", data.data.vendor_id);
        getProperties(token, data.data.vendor_id);
      } else {
        toast.error("Please log in as a vendor");
        setTimeout(() => navigate("/User/login"), 1000);
      }
    } catch (error) {
      toast.error("Failed to verify token");
      setTimeout(() => navigate("/User/login"), 1000);
    }
  };

  const getProperties = async (token, vendor_id) => {
    try {
      const response = await fetch(`${baseUrl}getVendorProperty.php`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const responseText = await response.text();
      const splitResponse = responseText.split("}{");
      const tokenData = JSON.parse(splitResponse[0] + "}");
      const propertiesData = JSON.parse("{" + splitResponse[1]);

      if (
        tokenData.success &&
        propertiesData.success &&
        Array.isArray(propertiesData.properties)
      ) {
        // Ensure each row has a unique id
        const propertiesWithId = propertiesData.properties.map((property) => ({
          ...property,
          id: property.property_id, // Set the unique id for each row
        }));

        setProperties(propertiesWithId); // Set the properties with the id
      } else {
        toast.error(propertiesData.message || "Failed to fetch properties.");
      }
    } catch (error) {
      toast.error("Error fetching properties.");
    }
  };

  const handleRowEdit = (newRowData) => {
    setEditedRow(newRowData); // Store the row that is being edited
  };

  const handleSave = async () => {
    if (editedRow) {
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseUrl}editVendorProperty.php`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedRow),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Property updated successfully!");
        setProperties((prevProperties) =>
          prevProperties.map((property) =>
            property.property_id === editedRow.property_id ? editedRow : property
          )
        );
        setEditedRow(null); // Clear the edited row after saving
      } else {
        toast.error(data.message || "Failed to update property.");
      }
    }
  };

  const handleDelete = async (propertyId) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("property_id", propertyId);

    try {
      const response = await fetch(`${baseUrl}deleteVendorProperty.php`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Property deleted successfully!");
        setProperties((prev) =>
          prev.filter((property) => property.property_id !== propertyId)
        );
      } else {
        toast.error(data.message || "Failed to delete property.");
      }
    } catch (error) {
      toast.error("Error deleting property.");
    }
  };

  const columns = [
    { field: "property_id", headerName: "Property ID", width: 150, editable: false },
    { field: "property_name", headerName: "Property Name", width: 200, editable: true },
    { field: "city", headerName: "City", width: 150, editable: true },
    { field: "location", headerName: "Location", width: 200, editable: true },
    { field: "p_type", headerName: "Property Type", width: 150, editable: true },
    { field: "bhk", headerName: "BHK", width: 100, editable: true },
    { field: "bedroom", headerName: "Bedrooms", width: 100, editable: true },
    { field: "bathroom", headerName: "Bathrooms", width: 100, editable: true },
    { field: "balcony", headerName: "Balconies", width: 100, editable: true },
    { field: "kitchen", headerName: "Kitchens", width: 100, editable: true },
    { field: "wifi", headerName: "Wi-Fi", width: 100, editable: true },
    { field: "utilities", headerName: "Utilities", width: 150, editable: true },
    { field: "parking", headerName: "Parking", width: 150, editable: true },
    { field: "pool", headerName: "Swimming Pool", width: 150, editable: true },
    { field: "pet_friendly", headerName: "Pet Friendly", width: 150, editable: true },
    { field: "peoples", headerName: "Max People", width: 120, editable: true },
    { field: "crib", headerName: "Crib", width: 100, editable: true },
    { field: "availability_status", headerName: "Availability", width: 150, editable: true },
    { field: "price_per_night", headerName: "Price/Night", width: 150, editable: true },
    { field: "check_in_time", headerName: "Check-in Time", width: 150, editable: true },
    { field: "check_out_time", headerName: "Check-out Time", width: 150, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            color="success"
            onClick={() => handleSave()}
          >
            Save
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDelete(params.row.property_id)}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <div>
      <h2>Manage Properties</h2>
      <div style={{ width: "100%", height: 500 }}>
        <DataGrid
          rows={properties}
          columns={columns}
          getRowId={(row) => row.property_id} // Ensure the row has a unique id
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          processRowUpdate={handleRowEdit} // Store row data when editing but don't auto-update
        />
      </div>
    </div>
  );
};

export default ManageProperties;
