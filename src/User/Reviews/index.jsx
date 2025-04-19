import React, { useEffect, useState } from 'react';
import { baseUrl } from '../../constants'; 
import './style.css'; 
import Navbar from '../../components/Navbar';

const UserReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem('token'); 
      if (!token) {
        setError('Unauthorized: No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}getUserReviews.php`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.success) {
          setReviews(result.data);
        } else {
          setError(result.message || 'Failed to fetch reviews');
        }
      } catch (err) {
        setError('Error fetching reviews: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
    <Navbar/>
    <div className="user-reviews-page">
      <h1>Your Reviews</h1>
      {reviews.length === 0 ? (
        <p>You haven't written any reviews yet.</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.review_id} className="review-card">
              <div className="review-header">
                <div className="property-info">
                  <h2 className="property-title">{review.property_name}</h2>
                  <p className="property-city">{review.city}</p>
                </div>
                <div className="reviewer-info">
                  <p className="reviewer-name">{review.name}</p>
                  <p className="review-date">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="review-body">
                <p className="review-text">{review.review_text}</p>
                <p className="review-rating">Rating: {review.rating} ★</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default UserReviewPage;
