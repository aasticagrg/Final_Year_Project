// src/pages/VendorDashboard.js
import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, Divider, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Line, Pie } from "react-chartjs-2";
import { FaMoneyBillWave, FaChartLine, FaStar, FaHome } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { baseUrl } from "../../constants";
import './style.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const VendorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [bookingView, setBookingView] = useState("monthly");
  const [earningsView, setEarningsView] = useState("monthly");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}getVendorDashboard.php`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setDashboardData(data.data);
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) return <Typography>Loading...</Typography>;

  const {
    total_properties, total_bookings, total_earnings, average_rating,
    rating_distribution = [], recent_bookings = [], recent_reviews = [],
    monthly_bookings = [], monthly_earnings = [], weekly_bookings = [], weekly_earnings = []
  } = dashboardData;

  const processChartData = (data, type) => {
    if (type === "weekly") {
      const sorted = [...data].sort((a, b) => parseInt(a.week) - parseInt(b.week));
      const labels = sorted.map(item => `Week ${item.week}`);
      const totals = sorted.map(item => item.total);
      return { labels, totals };
    } else {
      const monthOrder = {
        Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
        Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
      };
      const sorted = [...data].sort((a, b) => monthOrder[a.month] - monthOrder[b.month]);
      const labels = sorted.map(item => item.month);
      const totals = sorted.map(item => item.total);
      return { labels, totals };
    }
  };

  const bookingsProcessed = processChartData(bookingView === "monthly" ? monthly_bookings : weekly_bookings, bookingView);
  const earningsProcessed = processChartData(earningsView === "monthly" ? monthly_earnings : weekly_earnings, earningsView);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { 
        mode: 'index', 
        intersect: false,
        backgroundColor: 'rgba(45, 55, 72, 0.9)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      },
    },
    interaction: { mode: 'nearest', intersect: false },
    scales: {
      x: { 
        grid: { display: false },
        ticks: { color: '#4a5568', font: { size: 11 } }
      },
      y: { 
        beginAtZero: true, 
        grid: { color: '#e2e8f0' },
        ticks: { color: '#4a5568', font: { size: 11 }, padding: 8 }
      },
    },
    elements: {
      line: {
        borderWidth: 3
      },
      point: {
        radius: 5,
        hoverRadius: 7,
        borderWidth: 2,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff'
      }
    }
  };

  const bookingsChartData = {
    labels: bookingsProcessed.labels,
    datasets: [{
      label: "Bookings",
      data: bookingsProcessed.totals,
      borderColor: "#4299e1",
      backgroundColor: "rgba(66, 153, 225, 0.2)",
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: "#3182ce",
      borderWidth: 3,
      fill: true,
    }],
  };

  const earningsChartData = {
    labels: earningsProcessed.labels,
    datasets: [{
      label: "Earnings (₹)",
      data: earningsProcessed.totals,
      borderColor: "#48bb78",
      backgroundColor: "rgba(72, 187, 120, 0.2)",
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: "#38a169",
      borderWidth: 3,
      fill: true,
    }],
  };

  const hasRatings = rating_distribution.length > 0 && rating_distribution.some(r => r.count > 0);

  const ratingData = {
    labels: rating_distribution.map(item => `${item.rating} stars`),
    datasets: [{
      data: rating_distribution.map(item => item.count),
      backgroundColor: ["#4299e1", "#48bb78", "#ed8936", "#9f7aea", "#f56565"],
      hoverOffset: 6,
      borderWidth: 2,
      borderColor: "#ffffff",
    }],
  };

  const columns = [
    { field: "booking_id", headerName: "Booking ID", width: 150 },
    { field: "property_name", headerName: "Property", width: 200 },
    { field: "user_name", headerName: "Guest Name", width: 200 },
    { field: "booking_status", headerName: "Status", width: 150}, 
    { field: "check_in_date", headerName: "Check In", width: 150}, 
    { field: "check_out_date", headerName: "Check Out", width: 150}, 
    { field: "payment_status", headerName: "Payment Status", width: 150}
  ];

  return (
    <Box className="vd-container">
      <Typography className="vd-title" variant="h4" gutterBottom>Vendor Dashboard</Typography>

      <Grid container spacing={3} className="vd-stats-grid">
        <Grid item xs={12} md={3}><StatCard title="Total Properties" value={total_properties} icon={<FaHome />} /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Total Earnings" value={`₹${total_earnings}`} icon={<FaMoneyBillWave />} /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Total Bookings" value={total_bookings} icon={<FaChartLine />} /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Average Rating" value={average_rating} icon={<FaStar />} /></Grid>
      </Grid>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card className="vd-chart-card">
            <CardContent>
              <Typography className="vd-chart-title" variant="h6">Booking Overview</Typography>
              <div className="vd-toggle-buttons vd-booking-toggle">
                <Button onClick={() => setBookingView("monthly")} variant={bookingView === "monthly" ? "contained" : "outlined"}>Monthly</Button>
                <Button onClick={() => setBookingView("weekly")} variant={bookingView === "weekly" ? "contained" : "outlined"}>Weekly</Button>
              </div>
              <div className="vd-chart-wrapper vd-booking-chart">
                <Line data={bookingsChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="vd-chart-card">
            <CardContent>
              <Typography className="vd-chart-title" variant="h6">Earnings Overview</Typography>
              <div className="vd-toggle-buttons vd-earnings-toggle">
                <Button onClick={() => setEarningsView("monthly")} variant={earningsView === "monthly" ? "contained" : "outlined"}>Monthly</Button>
                <Button onClick={() => setEarningsView("weekly")} variant={earningsView === "weekly" ? "contained" : "outlined"}>Weekly</Button>
              </div>
              <div className="vd-chart-wrapper vd-earnings-chart">
                <Line data={earningsChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="vd-chart-card">
            <CardContent>
              <Typography className="vd-chart-title" variant="h6">Rating Distribution</Typography>
              <div
                className="vd-chart-wrapper vd-pie-chart"
                style={{ filter: hasRatings ? "none" : "grayscale(1)", opacity: hasRatings ? 1 : 0.6 }}
              >
                <Pie data={ratingData} />
              </div>
              {!hasRatings && (
                <Typography align="center" color="textSecondary" sx={{ mt: 2 }}>
                  No ratings available
                </Typography>
              )}
              <div className="vd-legend-container">
                {rating_distribution.map((item) => (
                  <div key={item.rating} className="vd-legend-item">
                    <div className="vd-color-box" style={{ backgroundColor: ["#4299e1", "#48bb78", "#ed8936", "#9f7aea", "#f56565"][item.rating - 1] }}></div>
                    <Typography variant="body2">{item.rating} Stars: {item.count} reviews</Typography>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card className="vd-table-card">
        <CardContent>
          <Typography className="vd-section-title" variant="h6">Recent Bookings</Typography>
          <Divider sx={{ mb: 2 }} />
          <div className="vd-datagrid" style={{ height: 400, width: '100%' }}>
            <DataGrid rows={recent_bookings} columns={columns} pageSize={5} getRowId={(row) => row.booking_id} />
          </div>
        </CardContent>
      </Card>

      <Card className="vd-table-card">
        <CardContent>
          <Typography className="vd-section-title" variant="h6">Recent Reviews</Typography>
          {recent_reviews.map((review) => (
            <Box key={review.review_id} className="vd-review-box">
              <Typography variant="body2"><strong>{review.user_name}</strong> rated {review.rating} stars</Typography>
              <Typography variant="body2">{review.review_text}</Typography>
              <Typography variant="body2" color="textSecondary">{review.created_at}</Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

const StatCard = ({ title, value, icon }) => (
  <Card className="vd-stat-card">
    <CardContent>
      <Typography className="vd-card-title" variant="h6">{icon} {title}</Typography>
      <Typography className="vd-card-value" variant="h5">{value}</Typography>
    </CardContent>
  </Card>
);

export default VendorDashboard;
