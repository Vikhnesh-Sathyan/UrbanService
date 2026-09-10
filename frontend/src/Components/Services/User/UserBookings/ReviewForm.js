import React from "react";

const ReviewForm = ({
  rating,
  review,
  setRating,
  setReview,
  loading,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="review-overlay">

      <div className="review-modal">

        <div className="review-header">

          <div>
            <span className="review-eyebrow">
              SERVICE REVIEW
            </span>

            <h2>
              Rate Your Experience
            </h2>

            <p>
              Share your experience with this service.
            </p>
          </div>

          <button
            type="button"
            className="review-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        <form onSubmit={onSubmit}>

          {/* RATING */}

          <div className="review-field">

            <label>
              Your Rating
            </label>

            <div className="rating-stars">

              {[1, 2, 3, 4, 5].map((star) => (

                <button
                  key={star}
                  type="button"
                  className={
                    star <= rating
                      ? "star active"
                      : "star"
                  }
                  onClick={() =>
                    setRating(star)
                  }
                >
                  ★
                </button>

              ))}

            </div>

          </div>


          {/* REVIEW */}

          <div className="review-field">

            <label>
              Your Review
            </label>

            <textarea
              value={review}
              onChange={(e) =>
                setReview(e.target.value)
              }
              placeholder="Tell us about your experience..."
              rows="5"
            />

          </div>


          {/* ACTIONS */}

          <div className="review-actions">

            <button
              type="button"
              className="review-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="review-submit"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Review"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ReviewForm;