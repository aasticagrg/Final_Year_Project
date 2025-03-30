import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import Navbar from "../../components/Navbar";
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import PropertyCard from "../../components/PropertyCard";
import { FaStar, FaHeart, FaRegHeart, FaMapMarkerAlt } from "react-icons/fa";

const Properties = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    
    const [properties, setProperties] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [filters, setFilters] = useState({
        budget: "",
        facilities: {
            parking: false,
            wifi: false,
            pets: false,
            pool: false
        },
        rating: {
            one: false,
            two: false,
            three: false,
            four: false,
            five: false
        }
    });
    const [searchParams, setSearchParams] = useState({
        location: "",
        checkIn: "",
        checkOut: "",
        guests: "1 guest, 1 room"
    });
    
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
    
    const toggleFavorite = (propertyId) => {
        setFavorites(prev => ({
            ...prev,
            [propertyId]: !prev[propertyId]
        }));
    };
    
    const handleFilterChange = (category, name, value) => {
        setFilters(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [name]: value
            }
        }));
    };
    
    const handleBudgetChange = (value) => {
        setFilters(prev => ({
            ...prev,
            budget: value
        }));
    };
    
    const clearFilters = () => {
        setFilters({
            budget: "",
            facilities: {
                parking: false,
                wifi: false,
                pets: false,
                pool: false
            },
            rating: {
                one: false,
                two: false,
                three: false,
                four: false,
                five: false
            }
        });
    };
    
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search functionality here
        console.log("Searching with params:", searchParams);
    };
    
    return (
        <>
            <Navbar />
            <div className="property-container">
                <div className="search-section">
                    <form onSubmit={handleSearch} className="search-box">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Where are you going?"
                            name="location"
                            value={searchParams.location}
                            onChange={handleSearchChange}
                        />
                        <input
                            type="text"
                            className="date-picker"
                            placeholder="Check-in date - Check-out date"
                            name="dates"
                            value={`${searchParams.checkIn} - ${searchParams.checkOut}`}
                            onChange={handleSearchChange}
                        />
                        <input
                            type="text"
                            className="guest-selector"
                            placeholder="1 guest, 1 room"
                            name="guests"
                            value={searchParams.guests}
                            onChange={handleSearchChange}
                        />
                        <button type="submit" className="search-button">Search</button>
                    </form>
                </div>
                
                <div className="properties-content">
                    <div className="filter-section">
                        <div className="filter-card">
                            <div className="filter-title">Filter by:</div>
                            <div className="budget-filter">
                                <label>Your budget:</label>
                                <input
                                    type="text"
                                    placeholder="Enter your budget"
                                    value={filters.budget}
                                    onChange={(e) => handleBudgetChange(e.target.value)}
                                />
                                <div className="filter-buttons">
                                    <button className="clear-button" onClick={clearFilters}>Clear</button>
                                    <button className="apply-button">Apply</button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="filter-card">
                            <div className="filter-title">Facilities:</div>
                            <div className="filter-group">
                                <div className="filter-option">
                                    <input
                                        type="checkbox"
                                        id="parking"
                                        checked={filters.facilities.parking}
                                        onChange={(e) => handleFilterChange('facilities', 'parking', e.target.checked)}
                                    />
                                    <label htmlFor="parking">Parking</label>
                                </div>
                                <div className="filter-option">
                                    <input
                                        type="checkbox"
                                        id="wifi"
                                        checked={filters.facilities.wifi}
                                        onChange={(e) => handleFilterChange('facilities', 'wifi', e.target.checked)}
                                    />
                                    <label htmlFor="wifi">Internet/WiFi</label>
                                </div>
                                <div className="filter-option">
                                    <input
                                        type="checkbox"
                                        id="pets"
                                        checked={filters.facilities.pets}
                                        onChange={(e) => handleFilterChange('facilities', 'pets', e.target.checked)}
                                    />
                                    <label htmlFor="pets">Pets allowed</label>
                                </div>
                                <div className="filter-option">
                                    <input
                                        type="checkbox"
                                        id="pool"
                                        checked={filters.facilities.pool}
                                        onChange={(e) => handleFilterChange('facilities', 'pool', e.target.checked)}
                                    />
                                    <label htmlFor="pool">Swimming Pool</label>
                                </div>
                                <button className="clear-button">Show all</button>
                            </div>
                        </div>
                        
                        <div className="filter-card">
                            <div className="filter-title">Property rating:</div>
                            <div className="filter-group">
                                <div className="filter-option">
                                    <input
                                        type="checkbox"
                                        id="one-star"
                                        checked={filters.rating.one}
                                        onChange={(e) => handleFilterChange('rating', 'one', e.target.checked)}
                                    />
                                    <label htmlFor="one-star">1 star</label>
                                </div>
                                <div className="filter-option">
                                    <input
                                        type="checkbox"
                                        id="two-star"
                                        checked={filters.rating.two}
                                        onChange={(e) => handleFilterChange('rating', 'two', e.target.checked)}
                                    />
                                    <label htmlFor="two-star">2 star</label>
                                </div>
                                <div className="filter-option">
                                    <input
                                        type="checkbox"
                                        id="three-star"
                                        checked={filters.rating.three}
                                        onChange={(e) => handleFilterChange('rating', 'three', e.target.checked)}
                                    />
                                    <label htmlFor="three-star">3 star</label>
                                </div>
                                <div className="filter-option">
                                    <input
                                        type="checkbox"
                                        id="four-star"
                                        checked={filters.rating.four}
                                        onChange={(e) => handleFilterChange('rating', 'four', e.target.checked)}
                                    />
                                    <label htmlFor="four-star">4 star</label>
                                </div>
                                <div className="filter-option">
                                    <input
                                        type="checkbox"
                                        id="five-star"
                                        checked={filters.rating.five}
                                        onChange={(e) => handleFilterChange('rating', 'five', e.target.checked)}
                                    />
                                    <label htmlFor="five-star">5 star</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="property-list">
                        <div className="properties-header">
                            <div className="properties-count">{properties.length} properties found</div>
                            <select className="sort-dropdown">
                                <option value="">Sort</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Rating</option>
                            </select>
                        </div>
                        
                        
                        <div className="property-list">
                            {properties.length > 0 ? (
                                properties.map((property) => (
                                    <PropertyCard key={property.property_id} property={property} />
                                ))
                            ) : (
                                <p className="no-properties">No properties available.</p>
                            )}
                    </div>
                </div>
            </div>
            </div>
            
            
        </>
    );
};
export default Properties;