import React, { useState } from 'react';
import StarRating from '../StarRating';
import { toast } from 'react-hot-toast';
import { baseUrl } from '../../constants';
import './style.css';

const ReviewForm = ({ propertyId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRatingValid, setIsRatingValid] = useState(true); // Add state to validate rating
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    console.log('handleSubmit function called!');
    e.preventDefault();
    console.log('Current rating:', rating);
    console.log('Current reviewText:', reviewText);
    console.log('Current propertyId:', propertyId);

    // Validate rating
    if (!rating || !reviewText.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (rating < 1 || rating > 5) {
      setIsRatingValid(false);
      toast.error('Please select a rating between 1 and 5.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}addReview.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          property_id: propertyId,
          rating,
          review_text: reviewText,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Review submitted successfully!');
        onReviewSubmitted(); // Refresh UI after review submission
        setRating(0);
        setReviewText('');
        setIsRatingValid(true); // Reset rating validation state
      } else {
        toast.error(data.message || 'Failed to submit review.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 className="review-form-title">Leave a Review</h3>
      <StarRating rating={rating} setRating={setRating} editable />
      {!isRatingValid && <span className="rating-error">Rating must be between 1 and 5.</span>}
      <textarea
        className="review-textarea"
        rows="4"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your experience..."
      />
      <button className="submit-button" type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;