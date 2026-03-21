import { supabase } from "../supabaseClient"

/**
 * Submit a rating with optional tags and comment
 * 
 * @param {number} userId - User ID
 * @param {number} roomId - Room ID
 * @param {number} stars - Rating stars (1-5)
 * @param {string[]} tags - Optional array of selected preset tags
 * @param {string} comment - Optional feedback comment
 * @returns {Promise<Object|null>} - Rating data or null if error
 * 
 * Database structure:
 * Table: ratings
 * - id (BIGINT PK)
 * - user_id (BIGINT FK)
 * - room_id (BIGINT FK)
 * - stars (INT 1-5)
 * - tags (JSONB/TEXT[] - preset tags)
 * - comment (TEXT - optional feedback)
 * - created_at (TIMESTAMP)
 * - updated_at (TIMESTAMP)
 */
export async function submitRating(userId, roomId, stars, tags = [], comment = "") {
  try {
    const { data, error } = await supabase
      .from("ratings")
      .insert([
        {
          user_id: userId,
          room_id: roomId,
          stars: stars,
          tags: tags.length > 0 ? JSON.stringify(tags) : null, // Store as JSON array
          comment: comment || null, // Store as TEXT or null if empty
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Rating submission error:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error submitting rating:", error)
    return null
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