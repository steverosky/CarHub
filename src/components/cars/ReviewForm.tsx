import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { addDoc, collection, doc, getDocs, updateDoc, query } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface ReviewFormProps {
  carId: string;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ carId, onReviewSubmitted }) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateCarRating = async () => {
    try {
      // Get all reviews for the car
      const reviewsQuery = query(collection(db, `vehicles/${carId}/reviews`));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      let totalRating = 0;
      let numReviews = 0;

      reviewsSnapshot.forEach((doc) => {
        const review = doc.data();
        totalRating += review.rating;
        numReviews++;
      });

      // Calculate average rating
      const averageRating = numReviews > 0 ? totalRating / numReviews : 0;

      // Update car document with new rating
      const carRef = doc(db, 'vehicles', carId);
      await updateDoc(carRef, {
        rating: Number(averageRating.toFixed(1)),
        reviewCount: numReviews
      });
    } catch (err) {
      console.error('Error updating car rating:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to submit a review');
      return;
    }
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Add the review
      await addDoc(collection(db, `vehicles/${carId}/reviews`), {
        userId: currentUser.id,
        userName: currentUser.name,
        rating,
        comment,
        date: new Date().toISOString()
      });
      
      // Update the car's average rating
      await updateCarRating();
      
      setComment('');
      setRating(0);
      onReviewSubmitted();
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-secondary-900 mb-2">
          Your Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-2xl focus:outline-none"
            >
              <FiStar
                className={`${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-secondary-900 mb-2">
          Your Review
        </label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Share your experience with this car..."
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !currentUser}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>

      {!currentUser && (
        <p className="text-sm text-secondary-500 text-center">
          Please log in to submit a review
        </p>
      )}
    </form>
  );
};

export default ReviewForm;