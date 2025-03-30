import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard'; 
import Navbar from '../../components/Navbar';  
import SearchForm from '../../components/SearchForm';  
// import './style.css';

const PropertiesPage = () => {
  // Retrieve properties from localStorage
  const properties = JSON.parse(localStorage.getItem('properties')) || [];

  // Check if no properties are found
  if (properties.length === 0) {
    return (
      <>
        <Navbar />
        <SearchForm />
        <div className="no-properties-message">
          <h2>No properties found matching your criteria.</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <SearchForm />
      <div className="properties-page">
        <h2>Available Properties</h2>
        <div className="properties-list">
          {properties.map((property) => (
            <PropertyCard key={property.property_id} property={property} />
          ))}
        </div>
      </div>
    </>
  );
};

export default PropertiesPage;
