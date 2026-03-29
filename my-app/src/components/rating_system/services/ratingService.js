import axiosClient from "../../../api/rumi_client"

/**
 * Check if user has already rated this room
 * @param {string} userId - User ID (UUID)
 * @param {number} roomId - Room ID
 * @returns {Promise<boolean>} - True if user has already rated this room
 */
export async function hasUserRated(userId, roomId) {
  try {
    const response = await axiosClient.get(`/ratings/check/${userId}/${roomId}`)
    return response.data.exists || false
  } catch (error) {
    console.error("Unexpected error checking rating:", error)
    return false
  }
}

/**
 * Submit a rating with optional tags and comment
 * 
 * @param {string} userId - User ID (UUID)
 * @param {number} roomId - Room ID
 * @param {number} stars - Rating stars (1-5)
 * @param {string[]} tags - Optional array of selected preset tags
 * @param {string} comment - Optional feedback comment
 * @returns {Promise<Object|null>} - Rating data or error message
 */
export async function submitRating(userId, roomId, stars, tags = [], comment = "") {
  try {
    // Check if user has already rated this room
    const alreadyRated = await hasUserRated(userId, roomId)
    if (alreadyRated) {
      return { error: "You have already rated this room" }
    }

    const response = await axiosClient.post("/ratings", {
      user_id: userId,
      room_id: roomId,
      stars: stars,
      tags: tags.length > 0 ? JSON.stringify(tags) : null,
      comment: comment || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    return { data: response.data }
  } catch (error) {
    console.error("Unexpected error submitting rating:", error)
    return { error: error.message }
  }
}

/**
 * Get all ratings for a room
 * @param {number} roomId - Room ID
 * @returns {Promise<Object[]|null>} - Array of ratings or null if error
 */
export async function getRoomRatings(roomId) {
  try {
    const response = await axiosClient.get(`/ratings/room/${roomId}`)
    return response.data || []
  } catch (error) {
    console.error("Unexpected error fetching ratings:", error)
    return null
  }
}

/**
 * Get average rating for a room
 * @param {number} roomId - Room ID
 * @returns {Promise<Object|null>} - Average stats or null if error
 */
export async function getRoomRatingStats(roomId) {
  try {
    const response = await axiosClient.get(`/ratings/room/${roomId}/stats`)
    return response.data || { average: 0, total: 0, distribution: {} }
  } catch (error) {
    console.error("Unexpected error fetching rating stats:", error)
    return null
  }
}

/**
 * Get all reviews for a room with comments and ratings
 * @param {number} roomId - Room ID
 * @returns {Promise<Array|null>} - Array of reviews with comments
 */
export async function getRoomReviews(roomId) {
  try {
    const response = await axiosClient.get(`/ratings/room/${roomId}/reviews`)
    return response.data || []
  } catch (error) {
    console.error("Unexpected error fetching reviews:", error)
    return []
  }
}