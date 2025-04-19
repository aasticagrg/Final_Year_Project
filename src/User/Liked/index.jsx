import { useEffect, useState } from "react";
import { baseUrl } from "../../constants";
import PropertyCard from "../../components/PropertyCard";
import Navbar from "../../components/Navbar";

const Liked = () => {
    const [likedProperties, setLikedProperties] = useState([]);
    const [likedIds, setLikedIds] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("likedProperties") || "[]");
        setLikedIds(stored);
    }, []);

    useEffect(() => {
        if (likedIds.length > 0) {
          fetch(`${baseUrl}getProperty.php?liked_ids=${likedIds.join(",")}`)

                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setLikedProperties(data.properties);
                    }
                });
        }
    }, [likedIds]);

    const removeFromLikes = (property) => {
        const updatedIds = likedIds.filter(id => id !== property.property_id);
        localStorage.setItem("likedProperties", JSON.stringify(updatedIds));
        setLikedIds(updatedIds);
        setLikedProperties(prev => prev.filter(p => p.property_id !== property.property_id));
    };

    return (
        <>
            <Navbar />
            <div className="property-container">
                <h2>Liked Properties</h2>
                {likedProperties.length > 0 ? (
                    likedProperties.map(property => (
                        <PropertyCard
                            key={property.property_id}
                            property={property}
                            isLiked={true}
                            onToggleLike={removeFromLikes}
                        />
                    ))
                ) : (
                    <p>No liked properties found.</p>
                )}
            </div>
        </>
    );
};

export default Liked;
