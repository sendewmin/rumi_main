package com.rumi.repository;

import com.rumi.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // Find all rooms posted by a specific landlord
    List<Room> findByLandlordId(Long landlordId);

    // Check if a room belongs to a specific landlord (used for security checks)
    boolean existsByIdAndLandlordId(Long id, Long landlordId);
}