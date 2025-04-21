import React, { useEffect, useState } from 'react';
import {
    Box, TextField, MenuItem, Button, Grid, Card, CardContent, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-hot-toast';
import { baseUrl } from '../../constants';
import './style.css'; // Import the CSS file

const AdminReport = () => {
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [vendorOptions, setVendorOptions] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        from: '',
        to: '',
        booking_status: '',
        payment_status: '',
        vendor_name: '',
        user_name: ''
    });

    const [summary, setSummary] = useState({
        total_completed: 0,
        total_cancelled: 0,
        total_revenue: 0,
        total_bookings: 0,
        total_properties: 0
    });

    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const fetchReport = async () => {
        setLoading(true);
        const queryParams = new URLSearchParams(filters).toString();

        try {
            const response = await fetch(`${baseUrl}adminReport.php?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (data.success) {
                const rowsWithId = data.data.map((row) => ({
                    ...row,
                    id: row.booking_id
                }));
                setBookings(rowsWithId);
                setSummary(data.summary);
            } else {
                toast.error(data.message || "Failed to load report data.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching report data.");
        }

        setLoading(false);
    };

    const fetchVendors = async () => {
        try {
            const response = await fetch(`${baseUrl}getVendors.php`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setVendorOptions(data.vendors || []);
            } else {
                toast.error(data.message || "Failed to fetch vendor list.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching vendor list.");
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${baseUrl}getUsers.php`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setUserOptions(data.users || []);
            } else {
                toast.error(data.message || "Failed to fetch user list.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching user list.");
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${baseUrl}getReviews.php`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                const reviewRows = data.reviews.map((review) => ({
                    ...review,
                    id: review.review_id
                }));
                setReviews(reviewRows);
            } else {
                toast.error(data.message || "Failed to fetch reviews list.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching reviews list.");
        }
    };

    const handleOpenReviewModal = (review) => {
        setSelectedReview(review);
        setOpenReviewModal(true);
    };

    const handleCloseReviewModal = () => {
        setOpenReviewModal(false);
        setSelectedReview(null);
    };

    useEffect(() => {
        fetchReport();
        fetchVendors();
        fetchUsers();
        fetchReviews();
    }, []);

    const columns = [
        { field: 'booking_id', headerName: 'Booking ID', width: 130 },
        { field: 'user_name', headerName: 'User Name', width: 150 },
        { field: 'property_name', headerName: 'Property Name', width: 180 },
        { field: 'vendor_name', headerName: 'Vendor Name', width: 160 },
        { field: 'city', headerName: 'City', width: 120 },
        { field: 'check_in_date', headerName: 'Check-in', width: 140 },
        { field: 'check_out_date', headerName: 'Check-out', width: 140 },
        { field: 'booking_status', headerName: 'Booking Status', width: 150 },
        { field: 'payment_status', headerName: 'Payment Status', width: 150 },
        { field: 'method', headerName: 'Payment Method', width: 150 },
        { field: 'amount', headerName: 'Amount Paid', width: 130 },
        { field: 'created_at', headerName: 'Payment Date', width: 170 },
    ];

    const reviewColumns = [
        { field: 'review_id', headerName: 'Review ID', width: 130 },
        { field: 'user_name', headerName: 'User Name', width: 150 },
        { field: 'property_name', headerName: 'Property Name', width: 180 },
        { field: 'rating', headerName: 'Rating', width: 120 },
        {
            field: 'review_text', headerName: 'Review Text', flex: 1, width: 150, renderCell: (params) => (
                <Box>
                    <Typography variant="body2" color="textSecondary" noWrap>{params.value}</Typography>
                    <Button
                        variant="text"
                        color="primary"
                        onClick={() => handleOpenReviewModal(params.row)}
                    >
                        View Full Review
                    </Button>
                </Box>
            )
        },
        { field: 'created_at', headerName: 'Review Date', width: 170 }
    ];

    return (
      <Box className="admin-report-container">
      <Typography variant="h5" className="report-title">
          Admin Booking Report
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} className="summary-cards">
          {Object.entries(summary).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={2.4} key={key}>
                  <Card className="summary-card">
                      <CardContent>
                          <Typography variant="subtitle2" className="summary-title">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Typography>
                          <Typography variant="h6" className="summary-value">
                              {key.includes('revenue') ? `Rs. ${value}` : value}
                          </Typography>
                      </CardContent>
                  </Card>
              </Grid>
          ))}
      </Grid>

            {/* Filters */}
            <div className="filters-section">
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            type="date"
                            label="From Date"
                            name="from"
                            fullWidth
                            value={filters.from}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            className="filter-input"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            type="date"
                            label="To Date"
                            name="to"
                            fullWidth
                            value={filters.to}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            className="filter-input"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            select
                            label="Booking Status"
                            name="booking_status"
                            fullWidth
                            value={filters.booking_status}
                            onChange={handleChange}
                            className="filter-dropdown"
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="booked">Booked</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            select
                            label="Payment Status"
                            name="payment_status"
                            fullWidth
                            value={filters.payment_status}
                            onChange={handleChange}
                            className="filter-dropdown"
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            select
                            label="Vendor"
                            name="vendor_name"
                            fullWidth
                            value={filters.vendor_name}
                            onChange={handleChange}
                            className="filter-dropdown"
                        >
                            <MenuItem value="">All Vendors</MenuItem>
                            {vendorOptions.map((vendor) => (
                                <MenuItem key={vendor.id} value={vendor.vendor_name}>
                                    {vendor.vendor_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            select
                            label="User"
                            name="user_name"
                            fullWidth
                            value={filters.user_name}
                            onChange={handleChange}
                            className="filter-dropdown"
                        >
                            <MenuItem value="">All Users</MenuItem>
                            {userOptions.map((user) => (
                                <MenuItem key={user.id} value={user.name}>
                                    {user.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} className="filter-button-container">
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={fetchReport}
                            className="apply-filters-button"
                        >
                            Apply Filters
                        </Button>
                    </Grid>
                </Grid>
            </div>

            {/* Bookings DataGrid */}
            {loading ? (
                <Box className="loading-container">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <div className="data-grid-container">
                        <Typography variant="h6" className="section-title">Bookings</Typography>
                        <div className={bookings.length > 10 ? "data-grid-max-height" : ""}>
                            <DataGrid
                                rows={bookings}
                                columns={columns}
                                pageSize={10}
                                rowsPerPageOptions={[10]}
                                disableSelectionOnClick
                                getRowId={(row) => row.id}
                                className="data-grid"
                                autoHeight={true}
                                hideFooterPagination={bookings.length <= 10}
                                disableExtendRowFullWidth={false}
                            />
                        </div>
                    </div>

                    {/* Reviews DataGrid - Updated part */}
                    <div className="data-grid-container">
                        <Typography variant="h6" className="section-title">Reviews</Typography>
                        <div className={reviews.length > 10 ? "data-grid-max-height" : ""}>
                            <DataGrid
                                rows={reviews}
                                columns={reviewColumns}
                                pageSize={10}
                                rowsPerPageOptions={[10]}
                                disableSelectionOnClick
                                getRowId={(row) => row.id}
                                className="data-grid"
                                autoHeight={true}
                                hideFooterPagination={reviews.length <= 10}
                                disableExtendRowFullWidth={false}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Review Modal */}
            <Dialog 
                open={openReviewModal} 
                onClose={handleCloseReviewModal} 
                fullWidth
                className="review-modal"
            >
                <DialogTitle className="modal-title">Review Details</DialogTitle>
                <DialogContent className="modal-content">
                    {selectedReview ? (
                        <>
                            <Typography variant="h6" className="property-name">{selectedReview.property_name}</Typography>
                            <Typography variant="body1" className="rating">Rating: {selectedReview.rating}</Typography>
                            <Typography variant="body2" color="textSecondary" className="review-text">
                                {selectedReview.review_text}
                            </Typography>
                        </>
                    ) : (
                        <CircularProgress />
                    )}
                </DialogContent>
                <DialogActions className="modal-actions">
                    <Button onClick={handleCloseReviewModal} color="primary" className="close-button">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminReport;