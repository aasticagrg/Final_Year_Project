import React, { useEffect, useState } from "react";
import {
  Box, TextField, Typography, Grid, Card, CardContent, Button, Select, MenuItem, InputLabel, FormControl
} from "@mui/material";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, ArcElement
} from "chart.js";
import { baseUrl } from "../../constants";
import "./style.css"; 

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, ArcElement);

const AdminRevenue = () => {
  const [filters, setFilters] = useState({
    startDate: "", endDate: "", vendorName: ""
  });

  const [data, setData] = useState({
    totals: {},
    monthlyRevenue: [],
    weeklyRevenue: [],
    paymentMethods: [],
    topProperties: [],
    categoryCounts: []
  });

  const [vendors, setVendors] = useState([]);
  const [properties, setProperties] = useState([]);

  const fetchData = async () => {
    let query = [];
    for (const key in filters) {
      if (filters[key]) {
        query.push(`${key}=${encodeURIComponent(filters[key])}`);
      }
    }
    const queryString = query.length ? `?${query.join("&")}` : "";

    const res = await fetch(`${baseUrl}adminGetRevenue.php${queryString}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const result = await res.json();
    if (result.success) setData(result);
  };

  const fetchVendorsAndProperties = async () => {
    // Fetching vendors
    const vendorRes = await fetch(`${baseUrl}getVendors.php`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const vendorResult = await vendorRes.json();
    if (vendorResult.success) setVendors(vendorResult.vendors || []);

    // Fetching properties
    const propertyRes = await fetch(`${baseUrl}adminGetProperties.php`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const propertyResult = await propertyRes.json();
    if (propertyResult.success) setProperties(propertyResult.properties || []);
  };

  useEffect(() => {
    fetchData();
    fetchVendorsAndProperties();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchData();
  };

  const {
    totals, monthlyRevenue, weeklyRevenue, paymentMethods, topProperties, categoryCounts
  } = data;

  // Chart options to maintain responsive behavior
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    }
  };

  const getLineChartData = (label, dataArr, labelKey) => ({
    labels: dataArr.map(item => item[labelKey]),
    datasets: [{
      label,
      data: dataArr.map(item => item.revenue),
      borderColor: "blue",
      backgroundColor: "rgba(0,0,255,0.1)",
      fill: true,
      tension: 0.4
    }],
  });

  const pieChartData = (labels, data, colors) => ({
    labels,
    datasets: [{
      label: "Distribution",
      data,
      backgroundColor: colors,
    }],
  });

  return (
    <Box className="admin-revenue-dashboard">
      <Typography className="dashboard-title" variant="h4" gutterBottom>Admin Revenue</Typography>

      {/* Filters */}
      <Grid container spacing={2} className="filters-container">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth 
            label="Start Date" 
            type="date" 
            name="startDate"
            InputLabelProps={{ 
              shrink: true,
              style: { backgroundColor: 'white', padding: '0 4px' }
            }} 
            value={filters.startDate} 
            onChange={handleFilterChange}
            className="filter-input"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth 
            label="End Date" 
            type="date" 
            name="endDate"
            InputLabelProps={{ 
              shrink: true,
              style: { backgroundColor: 'white', padding: '0 4px' }
            }} 
            value={filters.endDate} 
            onChange={handleFilterChange}
            className="filter-input"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth className="filter-select">
            <InputLabel 
              style={{ backgroundColor: 'white', padding: '0 4px', zIndex: 1 }}
            >
              Vendor Name
            </InputLabel>
            <Select
              name="vendorName"
              value={filters.vendorName}
              onChange={handleFilterChange}
              label="Vendor Name"
              displayEmpty
            >
              <MenuItem value=""><em>All Vendors</em></MenuItem>
              {vendors && vendors.length > 0 ? vendors.map((vendor) => (
                <MenuItem key={vendor.vendor_id} value={vendor.vendor_name}>
                  {vendor.vendor_name}
                </MenuItem>
              )) : <MenuItem disabled>No vendors available</MenuItem>}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button 
            variant="contained" 
            onClick={applyFilters} 
            className="apply-filters-button"
            fullWidth
            style={{ height: '56px' }}
          >
            Apply Filters
          </Button>
        </Grid>
      </Grid>

      {/* Summary */}
      <Grid container spacing={2} className="summary-cards">
        {[ 
          { label: "Total Completed Bookings", value: totals.total_completed },
          { label: "Total Cancelled Bookings", value: totals.total_cancelled },
          { label: "Total Properties", value: totals.total_properties },
          { label: "Total Revenue", value: `Rs. ${totals.total_revenue || 0}` },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} className="summary-card">
            <Card>
              <CardContent>
                <Typography variant="subtitle1">{item.label}</Typography>
                <Typography variant="h6">{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <div className="charts-container">
        {/* Line Charts Row */}
        <div className="line-charts-row">
          <div className="chart-item">
            <Typography variant="h6">Monthly Revenue</Typography>
            <div className="chart-canvas-container">
              <Line 
                data={getLineChartData("Monthly Revenue", monthlyRevenue, "month")}
                options={chartOptions}
              />
            </div>
          </div>
          <div className="chart-item">
            <Typography variant="h6">Weekly Revenue</Typography>
            <div className="chart-canvas-container">
              <Line 
                data={getLineChartData("Weekly Revenue", weeklyRevenue, "week")}
                options={chartOptions}
              />
            </div>
          </div>
        </div>

        {/* Pie Charts Row */}
        <div className="pie-charts-row">
          <div className="chart-item">
            <Typography variant="h6">Payment Methods</Typography>
            <div className="chart-canvas-container">
              <Pie
                data={pieChartData(
                  paymentMethods.map(p => p.method),
                  paymentMethods.map(p => p.total),
                  ["#FF6384", "#36A2EB", "#FFCE56"]
                )}
                options={chartOptions}
              />
            </div>
          </div>
          <div className="chart-item">
            <Typography variant="h6">Property Categories</Typography>
            <div className="chart-canvas-container">
              <Pie
                data={pieChartData(
                  categoryCounts.map(p => p.category),
                  categoryCounts.map(p => p.count),
                  ["#9C27B0", "#4CAF50", "#FFC107", "#FF5722"]
                )}
                options={chartOptions}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Properties */}
      <Box className="top-properties">
        <Typography variant="h6">Top Earning Properties</Typography>
        {topProperties.map((prop, idx) => (
          <Typography key={idx} variant="body1">
            {idx + 1}. {prop.property_name} - Rs. {prop.total_earned}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default AdminRevenue;