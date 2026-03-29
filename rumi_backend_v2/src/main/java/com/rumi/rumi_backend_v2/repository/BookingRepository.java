package com.rumi.rumi_backend_v2.repository;

import com.rumi.rumi_backend_v2.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByUserIdAndRoomId(String userId, Long roomId);
    List<Booking> findByUserId(String userId);
    List<Booking> findByRoomId(Long roomId);
    boolean existsByUserIdAndRoomId(String userId, Long roomId);
    boolean existsByUserIdAndRoomIdAndStatus(String userId, Long roomId, String status);
}
