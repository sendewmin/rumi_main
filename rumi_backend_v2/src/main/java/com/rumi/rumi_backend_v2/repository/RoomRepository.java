package com.rumi.repository;

import com.rumi.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    
    List<Room> findByLandlordId(Long landlordId);


    boolean existsByIdAndLandlordId(Long id, Long landlordId);
}