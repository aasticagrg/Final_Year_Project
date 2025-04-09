import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import {
    Box, Typography, TextField, Modal, Button
} from "@mui/material";

const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMessage, setSelectedMessage] = useState(null); // State for the selected message

    useEffect(() => {
        getContacts();
    }, [searchQuery]);

    const getContacts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseUrl}getQueries.php?search=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                setContacts(data.contacts);
            } else {
                toast.error(data.message || "Failed to fetch contacts");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { field: 'contact_id', headerName: 'ID', width: 70 },
        { field: 'full_name', headerName: 'Full Name', width: 180 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Phone', width: 150 },
        {
            field: 'message',
            headerName: 'Message',
            flex: 1,
            minWidth: 300,
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    sx={{
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        lineHeight: 1.5,
                        py: 1,
                        cursor: 'pointer', // Make the text clickable
                        '&:hover': { color: 'primary.main' } // Optional hover effect
                    }}
                    onClick={() => setSelectedMessage(params.value)} // Set the selected message on click
                >
                    {params.value}
                </Typography>
            )
        }
    ];

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Typography variant="h5" component="h4" gutterBottom>
                Contact Messages
            </Typography>

            <TextField
                label="Search by Name, Email or Phone"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={contacts}
                    columns={columns}
                    getRowId={(row) => row.contact_id}
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

            {/* Modal to display the full message */}
            <Modal open={!!selectedMessage} onClose={() => setSelectedMessage(null)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper', boxShadow: 24, p: 2, outline: 'none', maxWidth: '80%', maxHeight: '80vh',
                    overflowY: 'auto'
                }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Full Message
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                        {selectedMessage}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => setSelectedMessage(null)}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default AdminContacts;
