
import React from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, setRating, editable = false }) => {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={20}
          style={{ cursor: editable ? 'pointer' : 'default' }}
          color={star <= rating ? '#f5b301' : '#ccc'}
          onClick={() => editable && setRating(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
