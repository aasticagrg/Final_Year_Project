import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Select, MenuItem, Button } from '@mui/material';
import { baseUrl } from "../../constants";

const VendorPayments = () => {
  const [payments, setPayments] = useState([]);
  const [editedStatus, setEditedStatus] = useState({});

  const fetchPayments = async () => {
    const vendorId = localStorage.getItem('vendor_id');
    try {
      const response = await fetch(`${baseUrl}getVendorPayment.php?vendor_id=${vendorId}`);
      const data = await response.json();

      const withIds = data.payments.map((p) => ({
        ...p,
        id: p.payment_id,
      }));

      setPayments(withIds);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleStatusChange = (paymentId, newStatus) => {
    setEditedStatus((prev) => ({
      ...prev,
      [paymentId]: newStatus,
    }));
  };

  const saveStatus = async (paymentId) => {
    const status = editedStatus[paymentId];
    try {
      const response = await fetch(`${baseUrl}updatePaymentStatus.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_id: paymentId,
          payment_status: status,
        }),
      });

      const result = await response.json();
      if (result.success) {
        fetchPayments();
      } else {
        console.error('Update failed:', result.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const columns = [
    { field: 'payment_id', headerName: 'ID', width: 90 },
    { field: 'amount', headerName: 'Amount', width: 100 },
    { field: 'method', headerName: 'Method', width: 120 },
    { field: 'payment_date', headerName: 'Date', width: 150 },
    { field: 'user_name', headerName: 'User Name', width: 150 },
    { field: 'user_email', headerName: 'Email', width: 200 },
    { field: 'user_phone', headerName: 'Phone', width: 130 },
    {
      field: 'payment_status',
      headerName: 'Status',
      width: 160,
      renderCell: (params) => (
        <Select
          size="small"
          value={editedStatus[params.row.payment_id] || params.row.payment_status}
          onChange={(e) => handleStatusChange(params.row.payment_id, e.target.value)}
          disabled={params.row.method === 'online'}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => saveStatus(params.row.payment_id)}
          disabled={params.row.method === 'online'}
        >
          Save
        </Button>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: '100%' }}>
      <h2>Manage Payments</h2>
      <DataGrid
        rows={payments}
        columns={columns}
        getRowId={(row) => row.payment_id}
        disableSelectionOnClick
      />
    </div>
  );
};

export default VendorPayments;