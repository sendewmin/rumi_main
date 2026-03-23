import supabase from "../../../api/supabaseClient"

/**
 * Check if user has already rated this room
 * @param {string} userId - User ID (UUID)
 * @param {number} roomId - Room ID
 * @returns {Promise<boolean>} - True if user has already rated this room
 */
export async function hasUserRated(userId, roomId) {
  try {
    const { data, error } = await supabase
      .from("ratings")
      .select("id")
      .eq("user_id", userId)
      .eq("room_id", roomId)
      .limit(1)

    if (error) {
      console.error("Error checking existing rating:", error)
      return false
    }

    return data && data.length > 0
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

    const { data, error } = await supabase
      .from("ratings")
      .insert([
        {
          user_id: userId,
          room_id: roomId,
          stars: stars,
          tags: tags.length > 0 ? JSON.stringify(tags) : null,
          comment: comment || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Rating submission error:", error)
      return { error: error.message }
    }

    return { data }
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
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching room ratings:", error)
      return null
    }

    return data
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
    const { data, error } = await supabase
      .from("ratings")
      .select("stars")
      .eq("room_id", roomId)

    if (error) {
      console.error("Error fetching rating stats:", error)
      return null
    }

    if (data.length === 0) {
      return { average: 0, total: 0, distribution: {} }
    }

    const average = (data.reduce((sum, r) => sum + r.stars, 0) / data.length).toFixed(1)
    const distribution = {
      1: data.filter((r) => r.stars === 1).length,
      2: data.filter((r) => r.stars === 2).length,
      3: data.filter((r) => r.stars === 3).length,
      4: data.filter((r) => r.stars === 4).length,
      5: data.filter((r) => r.stars === 5).length,
    }

    return { average, total: data.length, distribution }
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
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching room reviews:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching reviews:", error)
    return []
  }
}