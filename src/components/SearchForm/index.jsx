import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from "../../constants"; // Import useNavigate for page redirection
import './style.css';

const SearchForm = () => {
  const [destination, setDestination] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use useNavigate to handle redirection

  const handleSearch = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const searchParams = new URLSearchParams({
      destination,
      checkInDate,
      checkOutDate,
      priceRange,
    });

    try {
      console.log('Fetching data with params: ', searchParams.toString()); // Debug: Check API request

      const response = await fetch(`${baseUrl}search.php?${searchParams}`);
      const data = await response.json();

      console.log('API Response: ', data); // Debug: Check API response

      if (data.length === 0) {
        setError('No properties found matching your criteria.');
      } else {
        // Store the properties data in localStorage
        localStorage.setItem('properties', JSON.stringify(data));
        
        // Redirect to the PropertiesPage
        navigate('/PropertiesPage');
      }
    } catch (err) {
      setError('Failed to fetch properties. Please try again.');
      console.error('Error fetching properties: ', err); // Debug: Check the error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Where are you going?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="search-input"
        />
        
        <input
          type="date"
          placeholder="Check-in Date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          className="search-input"
        />
        
        <input
          type="date"
          placeholder="Check-out Date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          className="search-input"
        />
        
        <input
          type="text"
          placeholder="Price Range"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="search-input"
        />
        
        <button type="submit" className="search-button">Search</button>
      </form>

      {loading && <p>Loading properties...</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SearchForm;
