import supabase from "./supabaseClient"

/**
 * Add a room to user's wishlist
 * @param {string} userId - User ID (UUID)
 * @param {number} roomId - Room ID
 * @returns {Promise<Object>} - Result with success/error
 */
export async function addToWishlist(userId, roomId) {
  try {
    const { data, error } = await supabase
      .from("wishlists")
      .insert([{ user_id: userId, room_id: roomId }])
      .select()

    if (error) {
      console.error("Error adding to wishlist:", error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error("Unexpected error adding to wishlist:", error)
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
    const { data, error } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", userId)
      .eq("room_id", roomId)
      .select()

    if (error) {
      console.error("Error removing from wishlist:", error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error("Unexpected error removing from wishlist:", error)
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
    const { data, error } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", userId)
      .eq("room_id", roomId)
      .limit(1)

    if (error) {
      console.error("Error checking wishlist:", error)
      return false
    }

    return data && data.length > 0
  } catch (error) {
    console.error("Unexpected error checking wishlist:", error)
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
    const { data, error } = await supabase
      .from("wishlists")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching wishlists:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching wishlists:", error)
    return []
  }
}
