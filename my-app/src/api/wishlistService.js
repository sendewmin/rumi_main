import axiosClient from "./rumi_client"

/**
 * Add a room to user's wishlist
 * @param {string} userId - User ID (UUID)
 * @param {number} roomId - Room ID
 * @returns {Promise<Object>} - Result with success/error
 */
export async function addToWishlist(userId, roomId) {
  try {
    const response = await axiosClient.post(`/wishlists`, {
      user_id: userId,
      room_id: roomId
    })
    return { data: response.data }
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return { error: error.message }
  }
}

/**
 * Remove a room from user's wishlist
 * @param {string} userId - User ID (UUID)
 * @param {number} roomId - Room ID
 * @returns {Promise<Object>} - Result with success/error
 */
export async function removeFromWishlist(userId, roomId) {
  try {
    const response = await axiosClient.delete(`/wishlists/${userId}/${roomId}`)
    return { data: response.data }
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return { error: error.message }
  }
}

/**
 * Check if a room is in user's wishlist
 * @param {string} userId - User ID (UUID)
 * @param {number} roomId - Room ID
 * @returns {Promise<boolean>} - True if in wishlist
 */
export async function isInWishlist(userId, roomId) {
  try {
    const response = await axiosClient.get(`/wishlists/${userId}/${roomId}/exists`)
    return response.data.exists || false
  } catch (error) {
    console.error("Error checking wishlist:", error)
    return false
  }
}

/**
 * Get all wishlisted rooms for a user
 * @param {string} userId - User ID (UUID)
 * @returns {Promise<Array>} - Array of wishlist items
 */
export async function getUserWishlists(userId) {
  try {
    const response = await axiosClient.get(`/wishlists/user/${userId}`)
    return response.data || []
  } catch (error) {
    console.error("Error fetching wishlists:", error)
    return []
  }
}
