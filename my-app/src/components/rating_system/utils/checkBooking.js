import supabase from "../../../api/supabaseClient"

export async function checkBooking(userId, roomId) {

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", userId)
    .eq("room_id", roomId)

  if (error) {
    console.error("Booking check error:", error)
    return false
  }

  return data.length > 0
}
