import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import Navbar from "../../components/Navbar";
import { baseUrl } from "../../constants";
import PropertyCard from "../../components/PropertyCard";
import toast from "react-hot-toast";

const Properties = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [properties, setProperties] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {      
            const response = await fetch(`${baseUrl}getProperty.php`);
            const data = await response.json();

            if (data.success) {
                setProperties(data.properties);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong while fetching properties.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="property-list">
                {properties.length > 0 ? (
                    properties.map((property) => (
                        <PropertyCard key={property.property_id} property={property} />
                    ))
                ) : (
                    <p className="no-properties">No properties available.</p>
                )}
            </div>
        </>
    );
};

export default Properties;
