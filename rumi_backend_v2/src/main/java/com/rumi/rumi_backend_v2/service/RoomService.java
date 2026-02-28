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

    // ─── CREATE a new room listing ────────────────────────────────────────────
    public Room createRoom(RoomRequest request, Long landlordId) {
        Room room = new Room();
        room.setTitle(request.getTitle());
        room.setDescription(request.getDescription());
        room.setRent(request.getRent());
        room.setLocation(request.getLocation());
        room.setLandlordId(landlordId);   // automatically set from logged-in user
        return roomRepository.save(room);
    }

    // ─── GET all rooms (any user can browse) ─────────────────────────────────
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // ─── GET single room by ID ────────────────────────────────────────────────
    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
    }

    // ─── GET rooms posted by a specific landlord ──────────────────────────────
    public List<Room> getRoomsByLandlord(Long landlordId) {
        return roomRepository.findByLandlordId(landlordId);
    }

    // ─── UPDATE a room (only the landlord who owns it can update) ─────────────
    public Room updateRoom(Long roomId, RoomRequest request, Long landlordId) {
        Room room = getRoomById(roomId);

        // Security check: make sure this landlord owns this room
        if (!room.getLandlordId().equals(landlordId)) {
            throw new RuntimeException("Access denied: You do not own this listing.");
        }

        room.setTitle(request.getTitle());
        room.setDescription(request.getDescription());
        room.setRent(request.getRent());
        room.setLocation(request.getLocation());
        return roomRepository.save(room);
    }

    // ─── DELETE a room (only the landlord who owns it can delete) ────────────
    public void deleteRoom(Long roomId, Long landlordId) {
        Room room = getRoomById(roomId);

        // Security check: make sure this landlord owns this room
        if (!room.getLandlordId().equals(landlordId)) {
            throw new RuntimeException("Access denied: You do not own this listing.");
        }

        roomRepository.delete(room);
    }
}