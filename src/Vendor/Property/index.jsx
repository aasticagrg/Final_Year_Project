import { useState, useEffect } from "react";
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import './style.css';

const ManageProperties = () => {
    const [properties, setProperties] = useState([]);
    const [editForm, setEditForm] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please log in as a vendor");
            setTimeout(() => navigate("/User/login"), 500);
            return;
        }
        getProperties();
    }, [navigate]);

    const getProperties = async () => {
        try {
            const response = await fetch(baseUrl + "getProperties.php");
            const data = await response.json();
            if (data.success) {
                setProperties(data.properties);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error fetching properties");
        }
    };

    const handleEdit = (property) => {
        setEditForm(property);
        navigate("/vendor/editProperty", { state: { property } });
    };

    const handleDelete = async (propertyId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${baseUrl}deleteProperty.php`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ property_id: propertyId })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Property deleted successfully!");
                getProperties(); // refresh properties after delete
            } else {
                toast.error(data.message || "Failed to delete property.");
            }
        } catch (error) {
            toast.error("Error deleting property.");
        }
    };

    const columns = [
        { field: 'property_id', headerName: 'Property ID', width: 150 },
        { field: 'property_name', headerName: 'Property Name', width: 200 },
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'price_per_night', headerName: 'Price/Night', width: 150 },
        {
            field: 'actions', 
            headerName: 'Actions', 
            width: 200, 
            renderCell: (params) => (
                <>
                    <button onClick={() => handleEdit(params.row)}>Edit</button>
                    <button onClick={() => handleDelete(params.row.property_id)}>Delete</button>
                </>
            )
        }
    ];

    return (
        <div>
            <h2>Manage Properties</h2>
            <div style={{ width: '100%', height: 400 }}>
                <DataGrid
                    rows={properties}
                    columns={columns}
                    getRowId={(row) => row.property_id}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                />
            </div>
        </div>
    );
};

export default ManageProperties;
