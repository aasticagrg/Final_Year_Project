import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Container,
  Divider,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { baseUrl } from "../../constants";
import "./style.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}adminDashboard.php`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const res = await response.json();
        if (res.success) {
          setData(res);
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error("Something went wrong!");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box className="dashboard__loading">
        <CircularProgress />
      </Box>
    );
  }

  // Modify weeks to month-week format (e.g., "April 1st Week")
  const formatWeeks = (weeks) => {
    return weeks.map((week, index) => {
      // Extract the year and week number from the 'YYYY-WXX' format
      const weekMatch = week.match(/^(\d{4})-(\d{2})$/);
      
      if (weekMatch) {
        const year = weekMatch[1];
        const weekNumber = parseInt(weekMatch[2]);
  
        // Get the first day of the week using JavaScript Date (we'll assume the first day is Monday)
        const date = new Date(year, 0, (weekNumber - 1) * 7 + 1); // Day 1 of the week (Monday)
        if (isNaN(date.getTime())) {
          console.error(`Invalid date for week ${week}: ${date}`);
          return `Invalid Date`;
        }
  
        const month = date.toLocaleString("default", { month: "long" });
        return `${month} ${index + 1}st Week`; // Format: Month Week 1st
      } else {
        // Handle any invalid format
        return `Invalid Week Format`;
      }
    });
  };
  
  const formatMonths = (months) => {
    return months.map((month) => {
      // Extract the year and month from the 'YYYY-MM' format
      const monthMatch = month.match(/^(\d{4})-(\d{2})$/);
  
      if (monthMatch) {
        const monthNumber = parseInt(monthMatch[2]);
  
        // Get the month name using Date object
        const date = new Date(0); // start from January
        date.setMonth(monthNumber - 1); // set the month (JavaScript months are 0-indexed)
  
        if (isNaN(date.getTime())) {
          console.error(`Invalid date for month ${month}: ${date}`);
          return `Invalid Month`;
        }
  
        // Return the full month name
        return date.toLocaleString("default", { month: "long" });
      } else {
        // Handle any invalid format
        return `Invalid Month Format`;
      }
    });
  };

  const infoCards = [
    { label: "Total Users", value: data?.totals?.total_users, icon: "👥" },
    { label: "Total Vendors", value: data?.totals?.total_vendors, icon: "🏪" },
    { label: "Total Properties", value: data?.totals?.total_properties, icon: "🏠" },
    { label: "Total Bookings", value: data?.totals?.total_bookings, icon: "📒" },
    { label: "Total Revenue", value: `Rs. ${data?.totals?.total_revenue}`, icon: "💰" },
  ];

  const lineChartData = {
    labels: formatWeeks(data.weeklyTrend?.map((item) => item.week)),
    datasets: [
      {
        label: "Weekly Bookings",
        data: data.weeklyTrend?.map((item) => item.count),
        borderColor: "#3f51b5",
        backgroundColor: "rgba(63, 81, 181, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const monthlyChartData = {
    labels: formatMonths(data.monthlyTrend?.map((item) => item.month)),
    datasets: [
      {
        label: "Monthly Bookings",
        data: data.monthlyTrend?.map((item) => item.count),
        borderColor: "#00c853",
        backgroundColor: "rgba(0, 200, 83, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };
  
  const topEarningVendorsData = {
    labels: data.topVendors?.map((item) => item.vendor_name),
    datasets: [
      {
        label: "Top Earning Vendors",
        data: data.topVendors?.map((item) => item.revenue),
        backgroundColor: ["#4caf50", "#ffeb3b", "#8bc34a", "#ff9800", "#f44336"],
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  const propertyCategoryData = {
    labels: data.propertyCategory?.map((item) => item.category),
    datasets: [
      {
        label: "Property Categories",
        data: data.propertyCategory?.map((item) => item.count),
        backgroundColor: ["#ff8a65", "#4db6ac", "#7986cb", "#e57373"],
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  // New Booking Status Chart Data
  const bookingStatusData = {
    labels: data.bookingStatus?.map((item) => item.booking_status),
    datasets: [
      {
        label: "Booking Status",
        data: data.bookingStatus?.map((item) => item.count),
        backgroundColor: ["#4caf50", "#ff9800", "#f44336", "#2196f3", "#9c27b0"],
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  const bookingsColumns = [
    { field: "booking_id", headerName: "Booking ID", width: 100 },
    { field: "name", headerName: "User", width: 150 },
    { field: "property_name", headerName: "Property", width: 200 },
    { field: "booking_status", headerName: "Status", width: 120 },
    { field: "created_at", headerName: "Date", width: 150 },
  ];

  const reviewsColumns = [
    { field: "review_id", headerName: "ID", width: 90 },
    { field: "name", headerName: "User", width: 150 },
    { field: "property_name", headerName: "Property", width: 200 },
    { field: "rating", headerName: "Rating", width: 100 },
    { field: "review_text", headerName: "Review", width: 300 },
    { field: "created_at", headerName: "Date", width: 150 },
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Container maxWidth="xl" className="dashboard">
      <Box className="dashboard__header">
        <Typography variant="h4" className="dashboard__title">
          Admin Dashboard
        </Typography>

        <Typography variant="subtitle1" className="dashboard__subtitle">
          Overview of bookings, users, and performance metrics
        </Typography>
        <Divider className="dashboard__divider" />
      </Box>

      <Grid container spacing={3} className="dashboard__summary-cards">
        {infoCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} className="dashboard__card">
              <span className="dashboard__card-icon">{card.icon}</span>
              <Box className="dashboard__card-content">
                <Typography variant="body2" className="dashboard__card-label">
                  {card.label}
                </Typography>
                <Typography variant="h5" className="dashboard__card-value">
                  {card.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Booking Trends */}
      <Box className="dashboard__section">
        <Typography variant="h6" className="dashboard__section-title">
          Booking Trends
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} className="dashboard__chart-card">
              <Typography variant="h6" className="dashboard__chart-title">
                Weekly Booking Trend
              </Typography>
              <Box className="dashboard__chart-container">
                <Line data={lineChartData} options={chartOptions} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} className="dashboard__chart-card">
              <Typography variant="h6" className="dashboard__chart-title">
                Monthly Booking Trend
              </Typography>
              <Box className="dashboard__chart-container">
                <Line data={monthlyChartData} options={chartOptions} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Charts Section */}
      <Box className="dashboard__section">
        <Typography variant="h6" className="dashboard__section-title">
          Performance Analytics
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} className="dashboard__chart-card">
              <Typography variant="h6" className="dashboard__chart-title">
                Top Earning Vendors
              </Typography>
              <Box className="dashboard__chart-container">
                <Bar data={topEarningVendorsData} options={barOptions} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} className="dashboard__chart-card">
              <Typography variant="h6" className="dashboard__chart-title">
                Property Categories
              </Typography>
              <Box className="dashboard__chart-container">
                <Pie data={propertyCategoryData} options={pieOptions} />
              </Box>
            </Paper>
          </Grid>
          {/* New Booking Status Pie Chart */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} className="dashboard__chart-card">
              <Typography variant="h6" className="dashboard__chart-title">
                Booking Status Distribution
              </Typography>
              <Box className="dashboard__chart-container">
                <Pie data={bookingStatusData} options={pieOptions} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Bookings Table */}
      <Box className="dashboard__section">
        <Typography variant="h6" className="dashboard__section-title">
          Recent Bookings
        </Typography>
        <Box className="dashboard__data-grid" style={{ height: 'auto' }}>
          <DataGrid
            rows={data.recentBookings || []}
            columns={bookingsColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row.booking_id}
            autoHeight
          />
        </Box>
      </Box>

      {/* Reviews Table */}
      <Box className="dashboard__section">
        <Typography variant="h6" className="dashboard__section-title">
          Recent Reviews
        </Typography>
        <Box className="dashboard__data-grid" style={{ height: 'auto' }}>
          <DataGrid
            rows={data.recentReviews || []}
            columns={reviewsColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row.review_id}
            autoHeight
          />
        </Box>
      </Box>
    </Container>
  );
};

export default AdminDashboard;