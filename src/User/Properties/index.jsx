import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import Navbar from "../../components/Navbar";
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import PropertyCard from "../../components/PropertyCard";

const Properties = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [properties, setProperties] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [sortOption, setSortOption] = useState("");
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
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        // Check token inside fetchProperties to avoid redirect issues
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/User/login");
            return;
        }

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
        console.log("Searching with params:", searchParams);
    };

    // 👉 Sort properties based on dropdown selection
    const sortedProperties = useMemo(() => {
        const sorted = [...properties];
    
        if (sortOption === "price-low") {
            sorted.sort((a, b) => a.price_per_night - b.price_per_night);
        } else if (sortOption === "price-high") {
            sorted.sort((a, b) => b.price_per_night - a.price_per_night);
        } else if (sortOption === "rating") {
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
    
        return sorted;
    }, [sortOption, properties]);

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
                                {["parking", "wifi", "pets", "pool"].map((facility) => (
                                    <div className="filter-option" key={facility}>
                                        <input
                                            type="checkbox"
                                            id={facility}
                                            checked={filters.facilities[facility]}
                                            onChange={(e) => handleFilterChange("facilities", facility, e.target.checked)}
                                        />
                                        <label htmlFor={facility}>{facility.charAt(0).toUpperCase() + facility.slice(1)}</label>
                                    </div>
                                ))}
                                <button className="clear-button">Show all</button>
                            </div>
                        </div>

                        <div className="filter-card">
                            <div className="filter-title">Property rating:</div>
                            <div className="filter-group">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <div className="filter-option" key={star}>
                                        <input
                                            type="checkbox"
                                            id={`${star}-star`}
                                            checked={filters.rating[["one", "two", "three", "four", "five"][star - 1]]}
                                            onChange={(e) =>
                                                handleFilterChange("rating", ["one", "two", "three", "four", "five"][star - 1], e.target.checked)
                                            }
                                        />
                                        <label htmlFor={`${star}-star`}>{star} star</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="property-list">
                        <div className="properties-header">
                            <div className="properties-count">{sortedProperties.length} properties found</div>
                            <select
                                className="sort-dropdown"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="">Sort</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Rating</option>
                            </select>
                        </div>

                        <div className="property-list">
                            {sortedProperties.length > 0 ? (
                                sortedProperties.map((property) => (
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
