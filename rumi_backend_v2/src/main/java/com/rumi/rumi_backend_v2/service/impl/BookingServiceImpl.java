package com.rumi.rumi_backend_v2.service.impl;

import com.rumi.rumi_backend_v2.entity.Booking;
import com.rumi.rumi_backend_v2.repository.BookingRepository;
import com.rumi.rumi_backend_v2.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {
    private static final Logger log = LoggerFactory.getLogger(BookingServiceImpl.class);
    private final BookingRepository bookingRepository;

    @Override
    public Booking createBooking(String userId, Long roomId, String status) {
        log.info("Creating booking for user {} and room {} with status {}", userId, roomId, status);
        
        // Check if booking already exists
        if (bookingRepository.existsByUserIdAndRoomId(userId, roomId)) {
            log.warn("Booking already exists for user {} and room {}", userId, roomId);
            return bookingRepository.findByUserIdAndRoomId(userId, roomId).get();
        }

        Booking booking = Booking.builder()
                .userId(userId)
                .roomId(roomId)
                .status(status)
                .build();
        
        Booking saved = bookingRepository.save(booking);
        log.info("Booking created successfully with id {} for user {} and room {}", saved.getId(), userId, roomId);
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkExistingBooking(String userId, Long roomId) {
        return bookingRepository.existsByUserIdAndRoomId(userId, roomId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getUserBookings(String userId) {
        log.info("Fetching bookings for user {}", userId);
        return bookingRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getRoomBookings(Long roomId) {
        log.info("Fetching bookings for room {}", roomId);
        return bookingRepository.findByRoomId(roomId);
    }

    @Override
    @Transactional(readOnly = true)
    public Booking getBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));
    }

    @Override
    public Booking updateBooking(Long id, String status) {
        log.info("Updating booking {} to status {}", id, status);
        
        Booking booking = getBooking(id);
        booking.setStatus(status);
        
        Booking updated = bookingRepository.save(booking);
        log.info("Booking {} updated to status {}", id, status);
        return updated;
    }

    @Override
    public void deleteBooking(Long id) {
        log.info("Deleting booking {}", id);
        bookingRepository.deleteById(id);
        log.info("Booking {} deleted", id);
    }
}
