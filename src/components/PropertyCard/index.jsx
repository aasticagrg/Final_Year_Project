import { useNavigate } from "react-router-dom"; 
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { baseUrl } from "../../constants";
import "./style.css"; 

const PropertyCard = ({ property }) => {
    const navigate = useNavigate();

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
                    <div className="property-rating">
                        {[...Array(3)].map((_, i) => (
                            <FaStar key={i} color="#FFC107" />
                        ))}
                    </div>
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
                <p className="rating">
                    <strong>4.0</strong> <span>12 reviews</span>
                </p>
                <p className="stay-info">1 night • 2 adults</p>
                <p className="price">NPR {property.price_per_night || "N/A"}</p>
                <p className="tax-info">Includes tax and charges</p>
                <button className="availability-btn" onClick={() => navigate(`/property/${property.property_id}`)}>
                    See Availability
                </button>
            </div>
        </div>
    );
};

export default PropertyCard;
