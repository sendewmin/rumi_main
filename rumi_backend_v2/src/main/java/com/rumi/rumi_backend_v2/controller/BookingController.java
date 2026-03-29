package com.rumi.rumi_backend_v2.controller;

import com.rumi.rumi_backend_v2.entity.Booking;
import com.rumi.rumi_backend_v2.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BookingController {
    private static final Logger log = LoggerFactory.getLogger(BookingController.class);
    
    @Autowired
    private BookingService bookingService;

    /**
     * Create a new booking
     */
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> request) {
        try {
            String userId = (String) request.get("user_id");
            Long roomId = ((Number) request.get("room_id")).longValue();
            String status = (String) request.getOrDefault("status", "confirmed");

            if (userId == null || roomId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing user_id or room_id"));
            }

            Booking booking = bookingService.createBooking(userId, roomId, status);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (Exception e) {
            log.error("Error creating booking: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to create booking"));
        }
    }

    /**
     * Check if user already has a booking for a room
     */
    @GetMapping("/check/{userId}/{roomId}")
    public ResponseEntity<?> checkExistingBooking(@PathVariable String userId, @PathVariable Long roomId) {
        try {
            boolean exists = bookingService.checkExistingBooking(userId, roomId);
            return ResponseEntity.ok(Map.of("exists", exists));
        } catch (Exception e) {
            log.error("Error checking booking: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to check booking"));
        }
    }

    /**
     * Get all bookings for a user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBookings(@PathVariable String userId) {
        try {
            return ResponseEntity.ok(bookingService.getUserBookings(userId));
        } catch (Exception e) {
            log.error("Error fetching bookings: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch bookings"));
        }
    }
}
