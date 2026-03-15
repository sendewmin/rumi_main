package com.rumi.service;

import com.rumi.dto.RoomRequest;
import com.rumi.entity.Room;
import com.rumi.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    
    public Room createRoom(RoomRequest request, Long landlordId) {
        Room room = new Room();
        room.setTitle(request.getTitle());
        room.setDescription(request.getDescription());
        room.setRent(request.getRent());
        room.setLocation(request.getLocation());
        room.setLandlordId(landlordId);   // automatically set from logged-in user
        return roomRepository.save(room);
    }

    
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    
    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
    }

    
    public List<Room> getRoomsByLandlord(Long landlordId) {
        return roomRepository.findByLandlordId(landlordId);
    }

    
    public Room updateRoom(Long roomId, RoomRequest request, Long landlordId) {
        Room room = getRoomById(roomId);

        
        if (!room.getLandlordId().equals(landlordId)) {
            throw new RuntimeException("Access denied: You do not own this listing.");
        }

        room.setTitle(request.getTitle());
        room.setDescription(request.getDescription());
        room.setRent(request.getRent());
        room.setLocation(request.getLocation());
        return roomRepository.save(room);
    }

    
    public void deleteRoom(Long roomId, Long landlordId) {
        Room room = getRoomById(roomId);

        
        if (!room.getLandlordId().equals(landlordId)) {
            throw new RuntimeException("Access denied: You do not own this listing.");
        }

        roomRepository.delete(room);
    }
}