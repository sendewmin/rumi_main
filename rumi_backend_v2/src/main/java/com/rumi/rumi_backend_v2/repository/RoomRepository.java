package com.roomlisting.repository;

import com.roomlisting.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // Find all rooms by a specific landlord
    List<Room> findByLandlordId(Long landlordId);

    // Search rooms by location (case-insensitive)
    List<Room> findByLocationContainingIgnoreCase(String location);

    // Search rooms by title keyword
    List<Room> findByTitleContainingIgnoreCase(String keyword);

    // Find rooms within a rent range
    List<Room> findByRentBetween(Double minRent, Double maxRent);

    // Find rooms by landlord and location
    List<Room> findByLandlordIdAndLocationContainingIgnoreCase(Long landlordId, String location);

    // Custom query: find rooms under a max rent
    @Query("SELECT r FROM Room r WHERE r.rent <= :maxRent ORDER BY r.rent ASC")
    List<Room> findRoomsUnderBudget(@Param("maxRent") Double maxRent);

    // Check if a room belongs to a landlord (for ownership validation)
    boolean existsByIdAndLandlordId(Long id, Long landlordId);
}