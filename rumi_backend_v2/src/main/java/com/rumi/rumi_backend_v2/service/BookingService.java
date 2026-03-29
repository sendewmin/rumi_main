package com.rumi.rumi_backend_v2.service;

import com.rumi.rumi_backend_v2.entity.Booking;
import java.util.List;

public interface BookingService {
    Booking createBooking(String userId, Long roomId, String status);
    boolean checkExistingBooking(String userId, Long roomId);
    List<Booking> getUserBookings(String userId);
    List<Booking> getRoomBookings(Long roomId);
    Booking getBooking(Long id);
    Booking updateBooking(Long id, String status);
    void deleteBooking(Long id);
}
