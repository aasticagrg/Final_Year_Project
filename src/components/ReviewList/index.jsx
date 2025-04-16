import React, { useEffect, useState } from 'react';
import StarRating from '../StarRating';
import { toast } from 'react-hot-toast';
import { baseUrl } from '../../constants';
import './style.css';

const ReviewList = ({ propertyId, refreshTrigger}) => {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [count, setCount] = useState(0);
  


  const fetchReviews = async () => {
    if (!propertyId) {
      console.error('Property ID is not provided');
      return; // Exit early if propertyId is not available
    }
  
    try {
      const res = await fetch(`${baseUrl}getPropertyReviews.php?property_id=${propertyId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setAvgRating(data.average_rating);
        setCount(data.total_reviews);
      } else {
        throw new Error(data.message); // if the data doesn't contain success
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      toast.error("Failed to load reviews. Please try again.");
    }
  };
  
  
  useEffect(() => {
    console.log('Fetching reviews for property:', propertyId);
    if (propertyId) {
      fetchReviews();
    }
  }, [propertyId, refreshTrigger]);
  
  
  // You can also log the reviews to check if the state is updating
  console.log('Reviews:', reviews);
  

  return (
    <div className="review-list-container">
      <h3 className="review-list-title">Reviews ({count})</h3>
      {avgRating !== null && (
        <div className="review-average">
          <StarRating rating={avgRating} editable={false} />
          <span className="avg-value">{avgRating} / 5</span>
        </div>
      )}
      {reviews.map((review) => (
        <div key={review.review_id} className="review-card">
          <div className="review-header">
            <span className="review-user">{review.user_name}</span>
            <StarRating rating={review.rating} editable={false} />
          </div>
          <p className="review-text">{review.review_text}</p>
          <span className="review-date">
            {new Date(review.created_at).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
