import React, { useEffect, useState } from "react"
import { getRoomRatingStats } from "../services/ratingService"
import "./ratingDisplay.css"

/**
 * Display room rating statistics and distribution
 * Shows average rating, total reviews, and star distribution breakdown
 */
function RatingDisplay({ roomId }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!roomId) return
      const data = await getRoomRatingStats(roomId)
      setStats(data)
      setLoading(false)
    }

    fetchStats()
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
    </div>
  )
}

export default RatingDisplay
