import React, { useEffect, useState } from 'react';
import StarRating from '../StarRating';
import { toast } from 'react-hot-toast';
import { baseUrl } from '../../constants';
import './style.css';

const ReviewList = ({ propertyId, refreshTrigger, limitReviews = 0 }) => {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [count, setCount] = useState(0);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${baseUrl}getPropertyReviews.php?property_id=${propertyId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setAvgRating(data.average_rating);
        setCount(data.total_reviews);
      } else {
        toast.error(data.message || 'Failed to load reviews');
      }
    } catch {
      toast.error("Failed to load reviews. Please try again.");
    }
  };

  const handleDelete = async (reviewId) => {
    toast.promise(
      (async () => {
        const res = await fetch(`${baseUrl}deleteReview.php`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ review_id: reviewId }),
        });
        const data = await res.json();
        if (data.success) {
          fetchReviews();
          return data;
        } else {
          throw new Error(data.message || 'Failed to delete review');
        }
      })(),
      {
        loading: 'Deleting review...',
        success: 'Review deleted successfully!',
        error: (err) => `${err.message || 'Something went wrong. Please try again.'}`
      }
    );
  };

  useEffect(() => {
    if (propertyId) {
      fetchReviews();
    }

    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${baseUrl}getUserDetails.php`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setLoggedInUserId(data.user.user_id);
          }
        })
        .catch(() => {});
    }
  }, [propertyId, refreshTrigger]);

  const displayedReviews = limitReviews > 0 ? reviews.slice(0, limitReviews) : reviews;

  return (
    <div className="review-list-container">
      <h3 className="review-list-title">Reviews ({count})</h3>
      {avgRating !== null && (
        <div className="review-average">
          <StarRating rating={avgRating} editable={false} />
          <span className="avg-value">{avgRating} / 5</span>
        </div>
      )}
      {displayedReviews.map((review) => (
        <div key={review.review_id} className="review-card">
          <div className="review-header">
            <span className="review-user">{review.user_name}</span>
            <StarRating rating={review.rating} editable={false} />
            {loggedInUserId === review.user_id && (
              <div className="review-actions">
                <button 
                  onClick={() => handleDelete(review.review_id)} 
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            )}
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
