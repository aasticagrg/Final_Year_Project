import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Modal } from "@mui/material";

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedImage, setSelectedImage] = useState(null); // Add state for selected image

    useEffect(() => {
        getUsers();
    }, [searchQuery]); // Re-fetch users whenever searchQuery changes

    const getUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseUrl}getUsers.php?search=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setUsers(data.users);
            } else {
                toast.error(data.message || "Failed to fetch users");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDeleteDialog = (user) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseUrl}deleteUser.php`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: selectedUser.user_id
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                toast.success(data.message);
                setUsers(users.filter(user => user.user_id !== selectedUser.user_id));
                handleCloseDialog();
            } else {
                toast.error(data.message || "Failed to remove user");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };

    const columns = [
        { field: 'user_id', headerName: 'USER ID', width: 100 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone_no', headerName: 'Phone', width: 150 },
        { field: 'user_address', headerName: 'Address', width: 200 },
        { field: 'role', headerName: 'Role', width: 120 },
        {
            field: 'user_verification',
            headerName: 'Verification',
            width: 150,
            renderCell: (params) => {
                const imageUrl = params.value ? `${baseUrl}${params.value}` : ""; // Construct the image URL
        
                return (
                    <div className="verification-image">
                        {imageUrl ? (
                            <img 
                                src={imageUrl} // Use the constructed URL
                                alt="User Verification"
                                style={{ width: 40, height: 40, cursor: 'pointer' }}
                                onClick={() => setSelectedImage(imageUrl)} // Show image in larger view
                            />
                        ) : (
                            <span>No Image</span> // Show message if no image
                        )}
                    </div>
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => handleOpenDeleteDialog(params.row)}
                >
                    Remove User
                </Button>
            )
        }
    ];

    return (
      <Box sx={{ width: '100%', height: '100%' }}>
          <Typography variant="h5" component="h2" gutterBottom>
              User Management
          </Typography>

          {/* Search Bar */}
          <TextField
              label="Search by Name"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
          />

          <Box sx={{ width: '100%', height: 500 }}>
              <DataGrid
                  rows={users}
                  columns={columns}
                  getRowId={(row) => row.user_id}
                  loading={loading}
                  initialState={{
                      pagination: {
                          paginationModel: { page: 0, pageSize: 10 },
                      },
                  }}
                  pageSizeOptions={[5, 10, 25]}
                  disableRowSelectionOnClick
              />
          </Box>

          {/* Image Modal */}
          <Modal open={!!selectedImage} onClose={() => setSelectedImage(null)}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper', boxShadow: 24, p: 2, outline: 'none'
            }}>
                <img src={selectedImage} alt="User Verification" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
            </Box>
          </Modal>

          <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm User Removal"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to remove this user? This action cannot be undone and all user data will be permanently deleted.
                        {selectedUser && (
                            <Box sx={{ mt: 2 }}>
                                <Typography component="div" variant="body2">
                                    <strong>Name:</strong> {selectedUser.name}
                                </Typography>
                                <Typography component="div" variant="body2">
                                    <strong>Email:</strong> {selectedUser.email}
                                </Typography>
                            </Box>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleDeleteUser} color="error" autoFocus>
                        Remove User
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminUser;
