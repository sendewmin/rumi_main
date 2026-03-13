import React, { useState } from "react"
import { submitRating } from "../services/ratingService"
import { checkBooking } from "../utils/checkBooking"

function RateRoom({ roomId, userId }) {

  const [stars, setStars] = useState(0)

  const handleSubmit = async () => {

    if (stars === 0) {
      alert("Please select a rating")
      return
    }

    const eligible = await checkBooking(userId, roomId)

    if (!eligible) {
      alert("You can only rate rooms you have booked")
      return
    }

    const result = await submitRating(userId, roomId, stars)

    if (result) {
      alert("Rating submitted successfully!")
    }

  }

  return (

    <div>

      <h3>Rate this room</h3>

      {[1,2,3,4,5].map((star) => (

        <button
          key={star}
          onClick={() => setStars(star)}
        >
          ⭐
        </button>

      ))}

      <br/>

      <button onClick={handleSubmit}>
        Submit Rating
      </button>

    </div>

  )
}

export default RateRoom
