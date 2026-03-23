import React, { useEffect, useState } from "react"
import { getRoomRatingStats, getRoomReviews } from "../services/ratingService"
import "./ratingDisplay.css"

/**
 * Display room rating statistics and distribution
 * Shows average rating, total reviews, and star distribution breakdown
 */
function RatingDisplay({ roomId }) {
  const [stats, setStats] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!roomId) return
      
      const statsData = await getRoomRatingStats(roomId)
      setStats(statsData)
      
      const reviewsData = await getRoomReviews(roomId)
      setReviews(reviewsData)
      
      setLoading(false)
    }

    fetchData()
  }, [roomId])

  if (loading) {
    return (
      <div className="rating-display-skeleton">
        <div className="skeleton-average"></div>
        <div className="skeleton-bars"></div>
      </div>
    )
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="rating-display-empty">
        <p>No ratings yet. Be the first to rate this room!</p>
      </div>
    )
  }

  return (
    <div className="rating-display-card">
      {/* Average Rating Section */}
      <div className="rating-average-section">
        <div className="average-score">
          <div className="score-number">{stats.average}</div>
          <div className="score-meta">
            <div className="score-stars">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`star-mini ${i < Math.round(stats.average) ? "filled" : ""}`}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="score-total">Based on {stats.total} reviews</div>
          </div>
        </div>
      </div>

      {/* Distribution Bars */}
      <div className="rating-distribution-section">
        <h3 className="distribution-title">Rating Breakdown</h3>
        <div className="distribution-bars">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.distribution[star] || 0
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0

            return (
              <div key={star} className="distribution-row">
                <div className="distribution-label">
                  <span className="star-label">{star}</span>
                  <span className="star-icon">★</span>
                </div>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${percentage}%`,
                      animation: `bar-grow 0.6s cubic-bezier(0.22, 1, 0.36, 1) both`,
                      animationDelay: `${(5 - star) * 0.1}s`,
                    }}
                  ></div>
                </div>
                <div className="distribution-count">{count}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* User Reviews Section */}
      {reviews.length > 0 && (
        <div className="reviews-section">
          <h3 className="reviews-title">Guest Reviews</h3>
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`star-mini ${i < review.stars ? "filled" : ""}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="review-date">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="review-comment">{review.comment}</p>
                )}
                {review.tags && (
                  <div className="review-tags">
                    {JSON.parse(review.tags || "[]").map((tag) => (
                      <span key={tag} className="review-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RatingDisplay
