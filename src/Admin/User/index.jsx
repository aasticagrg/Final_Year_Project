import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import { Box, Button, Typography, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(baseUrl + "getUsers.php", {
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
            
            const response = await fetch(baseUrl + "deleteUser.php", {
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
                // Remove the user from local state
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
            renderCell: (params) => (
                <Chip 
                    label={params.value === "1" ? "Verified" : "Unverified"} 
                    color={params.value === "1" ? "success" : "warning"} 
                    size="small"
                />
            )
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

            {/* Confirmation Dialog */}
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