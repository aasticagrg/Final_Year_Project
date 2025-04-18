import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { baseUrl } from "../../constants";
import "./style.css";

const HotelCard = ({ property }) => {
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
        <div className="hotel-card">
            {/* Hotel Image */}
            <div className="hotel-image">
                <img 
                    src={property.pimage1 ? baseUrl + property.pimage1 : "default-hotel.jpg"}
                    alt={property.property_name || "Hotel Image"} 
                />
            </div>
            
            {/* Hotel Information */}
            <div className="hotel-info">
                <h3 className="hotel-name">{property.property_name || "No Name"}</h3>
                <p className="hotel-location">
                    <FaMapMarkerAlt className="location-icon" /> {property.city || "Unknown Location"}
                </p>
                
                {/* Rating Stars */}
                {averageRating !== null && (
                    <div className="rating-container">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={i < Math.round(averageRating) ? "star filled" : "star"}
                                />
                            ))}
                        </div>
                        <span className="review-count">{totalReviews} reviews</span>
                    </div>
                )}
                
                {/* Description */}
                <p className="hotel-description">
                    {property.description || "No description available."}
                    {property.description && property.description.length > 80 && (
                        <span className="show-more">Show More</span>
                    )}
                </p>
                
                {/* Reserve Button */}
                <button 
                    className="reserve-button"
                    onClick={() => navigate(`/User/PropertyDetails/${property.property_id}`)}
                >
                    Reserve this stay
                </button>
            </div>
        </div>
    );
};

export default HotelCard;