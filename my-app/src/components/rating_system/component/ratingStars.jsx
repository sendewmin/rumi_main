import React from "react"

function RatingStars({ rating }) {

  const rounded = Math.round(rating)

  return (
    <div>

      {"⭐".repeat(rounded)}
      {"☆".repeat(5 - rounded)}

      <span> {rating}</span>

    </div>
  )
}

export default RatingStars