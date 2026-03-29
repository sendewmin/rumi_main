import axiosClient from "../../../api/rumi_client"

/**
 * Create a booking for a user
 * 
 * @param {string|number} userId - User ID (UUID or number)
 * @param {string|number} roomId - Room ID
 * @returns {Promise<Object|null>} - Booking data or null if error
 */
export async function createBooking(userId, roomId) {
  try {
    if (!userId || !roomId) {
      console.error("Missing userId or roomId:", { userId, roomId });
      throw new Error(`Missing parameters: userId=${userId}, roomId=${roomId}`);
    }

    // Ensure room ID is a number
    const parsedRoomId = typeof roomId === 'string' ? parseInt(roomId, 10) : roomId;
    
    if (!Number.isFinite(parsedRoomId)) {
      throw new Error(`Invalid roomId. Expected a number, got: ${roomId} (parsed as ${parsedRoomId})`);
    }
    
    console.log("Creating booking with:", { userId, parsedRoomId, roomIdType: typeof roomId });
    console.log("userId type:", typeof userId, "roomId type:", typeof parsedRoomId);

    const response = await axiosClient.post("/bookings", {
      user_id: userId,
      room_id: parsedRoomId,
      status: "confirmed",
    })

    console.log("Booking created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Unexpected error creating booking:", error);
    throw error;
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
    const response = await axiosClient.get(`/bookings/check/${userId}/${roomId}`)
    return response.data.exists || false
  } catch (error) {
    console.error("Unexpected error checking booking:", error)
    return false
  }
}
