import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography, Box } from '@mui/material';
import { baseUrl } from '../../constants';

const AdminUserBookings = () => {
  const { userId } = useParams();
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    

    fetch(`${baseUrl}adminUserBookings.php?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, [userId]);

  const columns = [
    { field: 'booking_id', headerName: 'Booking ID', width: 100 },
    { field: 'property_name', headerName: 'Property', width: 200 },
    { field: 'check_in_date', headerName: 'Check In', width: 150 },
    { field: 'check_out_date', headerName: 'Check Out', width: 150 },
    { field: 'booking_status', headerName: 'Booking status', width: 150 },
    { field: 'payment_method', headerName: 'Payment Method', width: 150 },
    { field: 'payment_amount', headerName: 'Total Amount', width: 150 },
    { field: 'payment_status', headerName: 'Payment Status', width: 150 },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Button variant="outlined" onClick={() => navigate('/Admin/Home')} sx={{ mb: 2 }}>
    ← Back to Dashboard
    </Button>

      <Typography variant="h5" gutterBottom>
        User Bookings
      </Typography>

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={bookings}
          columns={columns}
          getRowId={(row) => row.booking_id}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Box>
    </Box>
  );
};

export default AdminUserBookings;
