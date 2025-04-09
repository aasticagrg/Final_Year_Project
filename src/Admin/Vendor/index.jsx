import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import {
    Box, Button, Typography, TextField, Modal, Stack
} from "@mui/material";

const AdminVendor = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        getVendors();
    }, [searchQuery]);

    const getVendors = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseUrl}getVendors.php?search=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                setVendors(data.vendors);
            } else {
                toast.error(data.message || "Failed to fetch vendors");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateAccountStatus = async (vendor_id, status) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseUrl}updateVendorStatus.php`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    vendor_id,
                    account_status: status
                })
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                getVendors();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error updating account status");
        }
    };

    const updateVerificationStatus = async (vendor_id, status) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseUrl}updateVendorVerifyStatus.php`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    vendor_id,
                    verification_status: status
                })
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                getVendors();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error updating verification status");
        }
    };

    const columns = [
        { field: 'vendor_id', headerName: 'VENDOR ID', width: 100 },
        { field: 'vendor_name', headerName: 'Name', width: 150 },
        { field: 'vendor_email', headerName: 'Email', width: 200 },
        { field: 'contact_no', headerName: 'Phone', width: 130 },
        { field: 'vendor_address', headerName: 'Address', width: 180 },
        { field: 'role', headerName: 'Role', width: 100 },
        {
            field: 'vendor_verification',
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
                    {params.value === 'verified' ? 'Verified' : 'Not Verified'}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 340,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        color="warning"
                        onClick={() => updateAccountStatus(params.row.vendor_id, 'active')}
                        sx={{
                            width: '80px',
                            fontSize: '10px',
                            '&:hover': {
                                backgroundColor: '#ff9800',
                                color: '#fff',
                                transform: 'scale(1.05)', // Subtle zoom effect
                            },
                        }}
                    >
                        ACTIVATE
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => updateAccountStatus(params.row.vendor_id, 'deactivated')}
                        sx={{
                            width: '80px',
                            fontSize: '10px',
                            '&:hover': {
                                backgroundColor: '#f44336',
                                color: '#fff',
                                transform: 'scale(1.05)', // Subtle zoom effect
                            },
                        }}
                    >
                        DEACTIVATE
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        color="warning"
                        onClick={() => updateVerificationStatus(params.row.vendor_id, 'verified')}
                        sx={{
                            width: '80px',
                            fontSize: '10px',
                            '&:hover': {
                                backgroundColor: '#ff9800',
                                color: '#fff',
                                transform: 'scale(1.05)', // Subtle zoom effect
                            },
                        }}
                    >
                        VERIFY
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => updateVerificationStatus(params.row.vendor_id, 'not verified')}
                        sx={{
                            width: '80px',
                            fontSize: '10px',
                            '&:hover': {
                                backgroundColor: '#aa1409',
                                color: '#fff',
                                transform: 'scale(1.05)', // Subtle zoom effect
                            },
                        }}
                    >
                        REJECT
                    </Button>
                </Stack>
            )
        }
    ];

    return (
        <Box sx={{ width: '100%', height: '100%', fontWeight: 'bold' }}>
            <Typography variant="h5" component="h4" gutterBottom>
                Vendor Management
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
                    rows={vendors}
                    columns={columns}
                    getRowId={(row) => row.vendor_id}
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
                    <img src={selectedImage} alt="Vendor Verification" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
                </Box>
            </Modal>
        </Box>
    );
};

export default AdminVendor;
