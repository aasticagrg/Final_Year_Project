import React, { useState, useEffect, useRef } from 'react';
import Navbar from "../../components/Navbar";
import HotelCard from '../../components/HotelCard';
import SearchForm from "../../components/SearchForm";
import { baseUrl } from "../../constants";
import DestinationCard from "../../components/DestinationCard";
import "./style.css"; 

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
    
    const carouselRef = useRef(null);
    
    // Destination data
    const destinations = [
        { city: "Kathmandu", image: "../../../assets/kathmandu.jpg", description: "Heritage, Culture, Temples" },
        { city: "Pokhara", image: "../../../assets/pokhara.jpg", description: "Lakes, Mountains, Adventure" },
        { city: "Bhaktapur", image: "../../../assets/bhaktapur.jpg", description: "Heritage, Culture, Temples" },
        { city: "Chitwan", image: "../../../assets/chitwan.jpg", description: "Wildlife, Nature, Adventure" },
        { city: "Lumbini", image: "../../../assets/lumbini.jpg", description: "Heritage, Culture, Temples" },
        { city: "Lalitpur", image: "../../../assets/lalitpur.jpg", description: "Mountains, Nature, Adventure" },
        { city: "Biratnagar", image: "../../../assets/biratnagar.jpg", description: "Heritage, Culture, Temples" },
        { city: "Dharan", image: "../../../assets/dharan.jpg", description: "Heritage, Culture, Temples" },
        { city: "Nepalgunj", image: "../../../assets/nepalgunj.jpg", description: "Heritage, Culture, Temples" },
        { city: "Bandipur", image: "../../../assets/bandipur.jpg", description: "Heritage, Culture, Temples" }
    ];

    // Category data for the new Categories section
    const categories = [
        { name: "Luxury", image: "../../../assets/luxury.jpg" },
        { name: "Family-friendly", image: "../../../assets/family.jpg" },
        { name: "Pet-friendly", image: "../../../assets/pets.jpg" },
        { name: "Budget", image: "../../../assets/budget.jpg" }
    ];

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

        // Add scroll animation for featured sections
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const cardWidth = carouselRef.current.querySelector('.destination-card').offsetWidth + 20; // 20px for gap
            const scrollAmount = direction === 'next' ? cardWidth : -cardWidth;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            
            // Update current index for indicators
            if (direction === 'next' && currentCarouselIndex < Math.ceil(destinations.length / 3) - 1) {
                setCurrentCarouselIndex(currentCarouselIndex + 1);
            } else if (direction === 'prev' && currentCarouselIndex > 0) {
                setCurrentCarouselIndex(currentCarouselIndex - 1);
            }
        }
    };

    const scrollToIndex = (index) => {
        if (carouselRef.current) {
            const cardWidth = carouselRef.current.querySelector('.destination-card').offsetWidth + 20;
            const scrollPosition = index * cardWidth * 3; // 3 cards visible at a time
            carouselRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
            setCurrentCarouselIndex(index);
        }
    };

    return (
        <>
            <Navbar />
            <header>
                <div className="header-content">
                    <h2>Find Your Perfect Getaway, Where Comfort Meets Discovery</h2>
                    <p>From cozy city apartments to serene mountain retreats, explore handpicked stays that turn every trip into a memory worth keeping.</p>

                    <div className="search-form-wrapper">
                        <SearchForm />
                    </div>
                </div>
            </header>

            {/* Most Popular Section */}
            <section className="popular-section">
                <div className="section-header">
                    <h2>Experience the Comfort of Our Most Loved Stays</h2>
                    <a href="/User/Properties" className="see-all">See all</a>
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

            {/* Destination Section with Carousel */}
            <section className="destination-section">
                <div className="destination-title">
                    <h2>Wander Through the Most Loved Cities Around Nepal</h2>
                </div>
                
                <div className="destination-list" ref={carouselRef}>
                    {destinations.map((destination, index) => (
                        <div key={index} className="destination-wrapper">
                            <DestinationCard 
                                city={destination.city} 
                                image={destination.image} 
                                description={destination.description} 
                            />
                        </div>
                    ))}
                </div>
                
                <div className="carousel-nav">
                    <button onClick={() => scrollCarousel('prev')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <div className="carousel-indicators">
                        {Array.from({ length: Math.ceil(destinations.length / 3) }).map((_, index) => (
                            <div 
                                key={index}
                                className={`carousel-indicator ${index === currentCarouselIndex ? 'active' : ''}`}
                                onClick={() => scrollToIndex(index)}
                            />
                        ))}
                    </div>
                    <button onClick={() => scrollCarousel('next')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </section>

            {/* Featured Sections - Nepal Treasures */}
            <section className="featured-section">
                <div className="featured-container">
                    <div className="featured-image-wrapper scroll-animate">
                        <img src="../../../assets/treasures.jpg" alt="Nepal Treasures" className="featured-image" />
                    </div>
                    <div className="featured-content scroll-animate">
                        <h2>Discover Nepal's Hidden Treasures</h2>
                        <p>
                            Nepal is a land of infinite beauty, blending serene landscapes with rich traditions and vibrant cultures. From 
                            the tranquil Phewa Lake in Pokhara to the towering peaks of Mt. Everest, every corner of this enchanting Himalayan nation 
                            offers a unique adventure. Trek through the lush, jade-lit rhododendron forests, experience the thrill of white-water 
                            rafting, or find peace in the birthplace of Lord Buddha in Lumbini. Whether seeking adrenaline-pumping experiences 
                            or moments of quiet reflection, Nepal promises experiences that stay with you forever.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Sections - Nepal Hospitality */}
            <section className="featured-section">
                <div className="featured-container reverse">
                <div className="featured-image-wrapper scroll-animate">
                        <img src="../../../assets/hospitality.jpg" alt="Nepali Hospitality" className="featured-image" />
                    </div>
                    <div className="featured-content scroll-animate">
                        <h2>Experience Authentic Nepali Hospitality</h2>
                        <p>
                            Nepal's warmth isn't just found in its climate, but in the hearts of its people. Beyond the majestic 
                            Himalayas, cozy mountain lodges, and sun-drenched teahouses awaits an immersive cultural experience where 
                            they invite you into the soul of Nepali culture. Savor traditional dishes like dal-bhat and momos prepared 
                            with local spices, engage in meaningful conversations, and build connections that make your journey all the 
                            more enriching. In Nepal, every guest becomes a lifelong friend – a gateway to heartfelt experiences and 
                            memories that will last a lifetime.
                        </p>
                    </div>
                    
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <h2>Categories</h2>
                <div className="categories-grid">
                    {categories.map((category, index) => (
                        <a 
                            href={`/User/Properties?category=${category.name}`} 
                            key={index} 
                            className="category-card scroll-animate"
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            <div className="category-overlay">
                                <h3>{category.name}</h3>
                            </div>
                            <img src={category.image} alt={category.name} className="category-image" />
                        </a>
                    ))}
                </div>
            </section>
        </>
    );
};

export default Home;