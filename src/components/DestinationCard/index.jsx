import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../../constants"; // update the path as needed


const DestinationCard = ({ city, image, description }) => {
  const [propertyCount, setPropertyCount] = useState(0);

  useEffect(() => {
    fetch(`${baseUrl}getProperty.php?city=${city}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPropertyCount(data.properties.length);
        }
      })
      .catch(err => {
        console.error("Error fetching property count:", err);
      });
  }, [city]);

  return (
    <div className="destination-card">
      <img src={image} alt={city} className="destination-image" />
      <div className="destination-content">
        <h3>{city}</h3>
        <p className="description">{description}</p>
        <p className="count"><strong>{propertyCount} properties</strong></p>
        <Link to={`/User/Properties?city=${city}`}>
          <button className="explore-btn">Explore</button>
        </Link>
      </div>
    </div>
  );
};

export default DestinationCard;
