import { supabase } from "../supabaseClient"

/**
 * Create a booking for a user
 * 
 * @param {number} userId - User ID
 * @param {number} roomId - Room ID
 * @returns {Promise<Object|null>} - Booking data or null if error
 */
export async function createBooking(userId, roomId) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: userId,
          room_id: roomId,
          status: "confirmed",
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Booking error:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error creating booking:", error)
    return null
  }
}

/**
 * Check if user already has a booking for this room
 * 
 * @param {number} userId - User ID
 * @param {number} roomId - Room ID
 * @returns {Promise<boolean>} - True if booking exists
 */
export async function checkExistingBooking(userId, roomId) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userId)
      .eq("room_id", roomId)

    if (error) {
      console.error("Booking check error:", error)
      return false
    }

    return data && data.length > 0
  } catch (error) {
    console.error("Unexpected error checking booking:", error)
    return false
  }
}
