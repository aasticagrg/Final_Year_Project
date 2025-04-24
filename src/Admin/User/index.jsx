import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import {
    Box, Button, Typography, TextField, Modal, Stack
} from "@mui/material";

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        getUsers();
    }, [searchQuery]);

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
    const handleUserClick = (user) => {
        navigate(`/admin/UserBookings/${user.user_id}`);
      };

    const updateAccountStatus = async (user_id, status) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseUrl}updateUserStatus.php`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id,
                    account_status: status
                })
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                getUsers();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error updating account status");
        }
    };

    const updateVerificationStatus = async (user_id, status) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseUrl}updateVerificationStatus.php`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id,
                    verification_status: status
                })
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                getUsers();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error updating verification status");
        }
    };

    const columns = [
        { field: 'user_id', headerName: 'USER ID', width: 80 },
        {
            field: 'name',
            headerName: 'User Name',
            width: 150,
            renderCell: (params) => (
              <span
                style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => handleUserClick(params.row)}
              >
                {params.row.name}
              </span>
            )
          },
          
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone_no', headerName: 'Phone', width: 130 },
        { field: 'user_address', headerName: 'Address', width: 180 },
        { field: 'role', headerName: 'Role', width: 100 },
        {
            field: 'user_verification',
            headerName: 'Verification Image',
            width: 160,
            renderCell: (params) => {
                const imageUrl = params.value ? `${baseUrl}${params.value}` : "";
                return imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Verification"
                        style={{ width: 60, height: 40, cursor: 'pointer' }}
                        onClick={() => setSelectedImage(imageUrl)}
                    />
                ) : (
                    <span>No Image</span>
                );
            }
        },
        {
            field: 'account_status',
            headerName: 'Account Status',
            width: 150,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    {params.value === 'active' ? 'Active' : 'Deactivated'}
                </Typography>
            )
        },
        {
            field: 'verification_status',
            headerName: 'Verification Status',
            width: 180,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    {params.value === 'verified' ? 'Verified' :
                        params.value === 'rejected' ? 'Rejected' : 'Not Verified'}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 340,
            renderCell: (params) => {
                const { user_id, account_status, verification_status } = params.row;

                return (
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                        {/* Show ACTIVATE only when deactivated */}
                        {account_status === 'deactivated' && (
                            <Button
                                variant="outlined"
                                size="small"
                                color="warning"
                                onClick={() => updateAccountStatus(user_id, 'active')}
                                sx={{
                                    width: '80px',
                                    fontSize: '10px',
                                    '&:hover': {
                                        backgroundColor: '#ff9800',
                                        color: '#fff',
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            >
                                ACTIVATE
                            </Button>
                        )}

                        {/* Show DEACTIVATE only when active */}
                        {account_status === 'active' && (
                            <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                onClick={() => updateAccountStatus(user_id, 'deactivated')}
                                sx={{
                                    width: '80px',
                                    fontSize: '10px',
                                    '&:hover': {
                                        backgroundColor: '#f44336',
                                        color: '#fff',
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            >
                                DEACTIVATE
                            </Button>
                        )}

                        {/* Show VERIFY/REJECT only when not verified */}
                        {verification_status === 'not verified' && (
                            <>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="warning"
                                    onClick={() => updateVerificationStatus(user_id, 'verified')}
                                    sx={{
                                        width: '80px',
                                        fontSize: '10px',
                                        '&:hover': {
                                            backgroundColor: '#ff9800',
                                            color: '#fff',
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    VERIFY
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="error"
                                    onClick={() => updateVerificationStatus(user_id, 'rejected')}
                                    sx={{
                                        width: '80px',
                                        fontSize: '10px',
                                        '&:hover': {
                                            backgroundColor: '#aa1409',
                                            color: '#fff',
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    REJECT
                                </Button>
                            </>
                        )}
                    </Stack>
                );
            }
        }
    ];

    return (
        <Box sx={{ width: '100%', height: '100%', fontWeight: 'bold' }}>
            <Typography variant="h5" component="h4" gutterBottom>
                User Management
            </Typography>

            <TextField
                label="Search by Name"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    getRowId={(row) => row.user_id}
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
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper', boxShadow: 24, p: 2, outline: 'none'
                }}>
                    <img src={selectedImage} alt="User Verification" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
                </Box>
            </Modal>
        </Box>
    );
};

export default AdminUser;
