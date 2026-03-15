package com.roomlisting.service;

import com.roomlisting.dto.RoomRequestDTO;
import com.roomlisting.dto.RoomResponseDTO;
import com.roomlisting.dto.RoomUpdateDTO;
import com.roomlisting.entity.Room;
import com.roomlisting.exception.RoomNotFoundException;
import com.roomlisting.exception.UnauthorizedAccessException;
import com.roomlisting.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    // ─────────────────────────────────────────────────────────────
    // CREATE a new room listing (Landlord only)
    // ─────────────────────────────────────────────────────────────
    public RoomResponseDTO createRoom(RoomRequestDTO dto, Long landlordId) {
        Room room = new Room();
        room.setTitle(dto.getTitle());
        room.setDescription(dto.getDescription());
        room.setRent(dto.getRent());
        room.setLocation(dto.getLocation());
        room.setLandlordId(landlordId); // set from authenticated user

        Room saved = roomRepository.save(room);
        return mapToResponse(saved);
    }

    // ─────────────────────────────────────────────────────────────
    // UPDATE a room listing (Only the owner landlord)
    // ─────────────────────────────────────────────────────────────
    public RoomResponseDTO updateRoom(Long roomId, RoomUpdateDTO dto, Long landlordId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException(roomId));

        // ✅ Ownership check — is this landlord the owner?
        if (!room.getLandlordId().equals(landlordId)) {
            throw new UnauthorizedAccessException();
        }

        // Partial update — only update fields that are provided
        if (dto.getTitle() != null)       room.setTitle(dto.getTitle());
        if (dto.getDescription() != null) room.setDescription(dto.getDescription());
        if (dto.getRent() != null)        room.setRent(dto.getRent());
        if (dto.getLocation() != null)    room.setLocation(dto.getLocation());

        Room updated = roomRepository.save(room);
        return mapToResponse(updated);
    }

    // ─────────────────────────────────────────────────────────────
    // DELETE a room listing (Only the owner landlord)
    // ─────────────────────────────────────────────────────────────
    public void deleteRoom(Long roomId, Long landlordId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException(roomId));

        // ✅ Ownership check
        if (!room.getLandlordId().equals(landlordId)) {
            throw new UnauthorizedAccessException();
        }

        roomRepository.delete(room);
    }

    // ─────────────────────────────────────────────────────────────
    // GET a single room by ID (Public)
    // ─────────────────────────────────────────────────────────────
    public RoomResponseDTO getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException(roomId));
        return mapToResponse(room);
    }

    // ─────────────────────────────────────────────────────────────
    // GET all rooms (Public)
    // ─────────────────────────────────────────────────────────────
    public List<RoomResponseDTO> getAllRooms() {
        return roomRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────
    // GET all rooms by a specific landlord (Public)
    // ─────────────────────────────────────────────────────────────
    public List<RoomResponseDTO> getRoomsByLandlord(Long landlordId) {
        return roomRepository.findByLandlordId(landlordId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────
    // SEARCH rooms by location (Public)
    // ─────────────────────────────────────────────────────────────
    public List<RoomResponseDTO> searchByLocation(String location) {
        return roomRepository.findByLocationContainingIgnoreCase(location)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────
    // SEARCH rooms under budget (Public)
    // ─────────────────────────────────────────────────────────────
    public List<RoomResponseDTO> getRoomsUnderBudget(Double maxRent) {
        return roomRepository.findRoomsUnderBudget(maxRent)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────
    // HELPER: Map Room entity → RoomResponseDTO
    // ─────────────────────────────────────────────────────────────
    private RoomResponseDTO mapToResponse(Room room) {
        return new RoomResponseDTO(
                room.getId(),
                room.getTitle(),
                room.getDescription(),
                room.getRent(),
                room.getLocation(),
                room.getLandlordId(),
                room.getCreatedAt() != null ? room.getCreatedAt().toString() : null,
                room.getUpdatedAt() != null ? room.getUpdatedAt().toString() : null
        );
    }
}