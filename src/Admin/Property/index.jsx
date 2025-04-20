import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import {
  Box, Button, Typography, TextField, Modal,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";

const AdminProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // New state for confirmation dialog
  const [openConfirm, setOpenConfirm] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, [searchQuery]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}adminGetProperties.php?search=${searchQuery}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProperties(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch properties");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = (property_id) => {
    setPropertyToDelete(property_id);
    setOpenConfirm(true);
  };

  const handleCancelDelete = () => {
    setOpenConfirm(false);
    setPropertyToDelete(null);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}adminDeleteProperty.php`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ property_id: propertyToDelete })
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Property deleted successfully");
        fetchProperties();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error deleting property");
      console.error(error);
    } finally {
      setOpenConfirm(false);
      setPropertyToDelete(null);
    }
  };

  const columns = [
    { field: 'property_id', headerName: 'ID', width: 70 },
    { field: 'property_name', headerName: 'Property Name', width: 200 },
    { field: 'vendor_name', headerName: 'Vendor', width: 150 },
    { field: 'contact_no', headerName: 'Contact', width: 130 },
    { field: 'city', headerName: 'City', width: 100 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'price_per_night', headerName: 'Price/Night', width: 110 },
    { field: 'p_type', headerName: 'Type', width: 100 },
    { field: 'bhk', headerName: 'BHK', width: 80 },
    {
      field: 'pimage1',
      headerName: 'Image',
      width: 120,
      renderCell: (params) => {
        const imageUrl = params.value ? `${baseUrl}${params.value}` : "";
        return imageUrl ? (
          <img
            src={imageUrl}
            alt="Property"
            style={{ width: 60, height: 40, cursor: 'pointer' }}
            onClick={() => setSelectedImage(imageUrl)}
          />
        ) : (
          <span>No Image</span>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleConfirmDelete(params.row.property_id)}
          sx={{
            fontSize: '10px',
            '&:hover': {
              backgroundColor: '#f44336',
              color: '#fff',
              transform: 'scale(1.05)',
            }
          }}
        >
          DELETE
        </Button>
      )
    }
  ];

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Typography variant="h5" component="h4" gutterBottom>
        Property Management
      </Typography>

      <TextField
        label="Search by Property Name"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={properties}
          columns={columns}
          getRowId={(row) => row.property_id}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          disableRowSelectionOnClick
        />
      </Box>

      <Modal open={!!selectedImage} onClose={() => setSelectedImage(null)}>
        <Box sx={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          outline: 'none'
        }}>
          <img
            src={selectedImage}
            alt="Property"
            style={{ maxWidth: '100%', maxHeight: '80vh' }}
          />
        </Box>
      </Modal>

      {/* 🧾 Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this property?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProperty;
