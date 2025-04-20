import React, { useEffect, useState } from 'react';
import { TextField, Box, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react';
import { baseUrl } from '../../constants';

const AdminBookingPayments = () => {
    const [bookings, setBookings] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBookingPayments();
    }, [search]);

    const fetchBookingPayments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}adminGetBookingPayments.php?search=${search}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                // Add 'id' field to each booking for DataGrid
                const bookingsWithId = data.data.map((booking) => ({
                    ...booking,
                    id: booking.booking_id,
                }));
                setBookings(bookingsWithId);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('An error occurred while fetching booking and payment details.');
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const columns = [
        { field: 'booking_id', headerName: 'Booking ID', width: 130 },
        { field: 'name', headerName: 'User Name', width: 150 },
        { field: 'property_name', headerName: 'Property Name', width: 180 },
        { field: 'vendor_name', headerName: 'Vendor Name', width: 160 },
        { field: 'city', headerName: 'City', width: 120 },
        { field: 'check_in_date', headerName: 'Check-in', width: 140 },
        { field: 'check_out_date', headerName: 'Check-out', width: 140 },
        { field: 'total_price', headerName: 'Total Price', width: 130 },
        { field: 'payment_status', headerName: 'Payment Status', width: 150 },
        { field: 'method', headerName: 'Payment Method', width: 150 },
        { field: 'amount', headerName: 'Amount Paid', width: 130 },
        { field: 'created_at', headerName: 'Payment Date', width: 170 },
    ];

    return (
        <div>
            <h2>Booking Payments</h2>

            {/* Search Box */}
            <Box sx={{ marginBottom: '20px' }}>
                <TextField
                    label="Search by Property or Vendor Name"
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={handleSearchChange}
                />
            </Box>

            {/* DataGrid for displaying bookings */}
            {loading ? (
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={bookings}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                        getRowId={(row) => row.id}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminBookingPayments;
