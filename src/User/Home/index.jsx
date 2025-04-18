import React, { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar";
import HotelCard from '../../components/HotelCard';
import SearchForm from "../../components/SearchForm";
import { baseUrl } from "../../constants";
import "./style.css"; 

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch properties from the backend API
        const fetchProperties = async () => {
            try {
                const response = await fetch(`${baseUrl}getProperty.php`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.success) {
                    // Sort properties by average rating (highest first)
                    const sortedProperties = (data.properties || []).sort((a, b) => 
                        (b.average_rating || 0) - (a.average_rating || 0)
                    );
                    setProperties(sortedProperties);
                } else {
                    setError(data.message || "Failed to fetch properties");
                }
            } catch (error) {
                console.error("Error fetching properties:", error);
                setError("Error loading properties. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    return (
        <>
            <Navbar />
            <header>
            <div className="header-content">
                <h2> Find Your Perfect Getaway, Where Comfort Meets Discovery</h2>
                <p>From cozy city apartments to serene mountain retreats, explore handpicked stays that turn every trip into a memory worth keeping.</p>

                <div className="search-form-wrapper">
                <SearchForm />
                </div>
            </div>
            </header>

            
            {/* Most Popular Section */}
            <section className="popular-section">
                <div className="section-header">
                    <h2>Most Popular</h2>
                    <a href="/properties" className="see-all">See all</a>
                </div>
                
                {loading ? (
                    <div className="loading">Loading properties...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="property-grid">
                        {properties.slice(0, 3).map(property => (
                            <div key={property.property_id} className="property-card-wrapper">
                                <HotelCard property={property} />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
};

export default Home;