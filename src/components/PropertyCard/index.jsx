import { useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";

import { baseUrl } from "../../constants";
import "./style.css"; 

const PropertyCard = ({ property }) => {
    const navigate = useNavigate();
    const [averageRating, setAverageRating] = useState(null);
    const [totalReviews, setTotalReviews] = useState(0);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const res = await fetch(`${baseUrl}getPropertyReviews.php?property_id=${property.property_id}`);
                const data = await res.json();
                if (data.success) {
                    setAverageRating(data.average_rating);
                    setTotalReviews(data.total_reviews);
                }
            } catch (error) {
                console.error("Error fetching ratings:", error);
            }
        };

        if (property?.property_id) {
            fetchRating();
        }
    }, [property?.property_id]);

    if (!property) {
        return <p className="error-message">Property data is missing.</p>;
    }

    return (
        <div className="property-card">
            {/* Left Section - Property Image */}
            <div className="property-image">
                <img 
                    src={property.pimage1 ? baseUrl + property.pimage1 : "default-image.jpg"} 
                    alt={property.property_name || "Property Image"} 
                />
                <button className="wishlist-btn">♡</button>
            </div>

            {/* Middle Section - Property Details */}
            <div className="property-info">
                <div className="property-header">
                    <h3 className="property-name">{property.property_name || "No Name"}</h3>
                    <p className="property-location">
                        <FaMapMarkerAlt className="icon" /> {property.city || "Unknown City"}
                    </p>
                </div>
                <p className="property-description">{property.description || "No description available."}</p>
                <p className="property-amenities">
                    {property.bhk || "N/A"} BHK | {property.bedroom || "N/A"} Bedroom | 
                    {property.bathroom || "N/A"} Bathroom | {property.kitchen || "N/A"} Kitchen | 
                    {property.balcony || "N/A"} Balcony
                </p>
            </div>

            {/* Right Section - Price & Button */}
            <div className="property-price">
                {/* ⭐ Rating Section */}
                {averageRating !== null && (
                    <div className="property-rating">
                        <span className="stars">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={i < Math.round(averageRating) ? "star filled" : "star"}
                                />
                            ))}
                        </span>
                        <span className="rating-text">{averageRating} ({totalReviews} reviews)</span>
                    </div>
                )}

                <div>Max Adults: {property.peoples || "N/A"}</div>
                <p className="price">NPR {property.price_per_night || "N/A"}</p>
                <p className="tax-info">Includes tax and charges</p>
                <button 
                    className="availability-btn" 
                    onClick={() => navigate(`/User/PropertyDetails/${property.property_id}`)}
                >
                    See Availability
                </button>
            </div>
        </div>
    );
};

export default PropertyCard;
