package com.roomlisting.controller;

import com.roomlisting.dto.RoomRequestDTO;
import com.roomlisting.dto.RoomResponseDTO;
import com.roomlisting.dto.RoomUpdateDTO;
import com.roomlisting.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
public class RoomController {

    @Autowired
    private RoomService roomService;

    // ─────────────────────────────────────────────────────────────
    // POST /api/rooms
    // Create a new room listing
    // Header: X-Landlord-Id: {landlordId}   ← simulates auth token
    // ─────────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<Map<String, Object>> createRoom(
            @Valid @RequestBody RoomRequestDTO dto,
            @RequestHeader("X-Landlord-Id") Long landlordId) {

        RoomResponseDTO created = roomService.createRoom(dto, landlordId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Room listing created successfully");
        response.put("room", created);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ─────────────────────────────────────────────────────────────
    // PUT /api/rooms/{id}
    // Update an existing room (owner landlord only)
    // Header: X-Landlord-Id: {landlordId}
    // ─────────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody RoomUpdateDTO dto,
            @RequestHeader("X-Landlord-Id") Long landlordId) {

        RoomResponseDTO updated = roomService.updateRoom(id, dto, landlordId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Room listing updated successfully");
        response.put("room", updated);

        return ResponseEntity.ok(response);
    }

    // ─────────────────────────────────────────────────────────────
    // DELETE /api/rooms/{id}
    // Delete a room listing (owner landlord only)
    // Header: X-Landlord-Id: {landlordId}
    // ─────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteRoom(
            @PathVariable Long id,
            @RequestHeader("X-Landlord-Id") Long landlordId) {

        roomService.deleteRoom(id, landlordId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Room listing deleted successfully");
        response.put("roomId", id);

        return ResponseEntity.ok(response);
    }

    // ─────────────────────────────────────────────────────────────
    // GET /api/rooms/{id}
    // Get a single room by ID (Public)
    // ─────────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<RoomResponseDTO> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    // ─────────────────────────────────────────────────────────────
    // GET /api/rooms
    // Get all rooms (Public) — supports optional filters:
    //   ?location=colombo
    //   ?maxRent=25000
    //   ?landlordId=5
    // ─────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<RoomResponseDTO>> getAllRooms(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double maxRent,
            @RequestParam(required = false) Long landlordId) {

        List<RoomResponseDTO> rooms;

        if (location != null) {
            rooms = roomService.searchByLocation(location);
        } else if (maxRent != null) {
            rooms = roomService.getRoomsUnderBudget(maxRent);
        } else if (landlordId != null) {
            rooms = roomService.getRoomsByLandlord(landlordId);
        } else {
            rooms = roomService.getAllRooms();
        }

        return ResponseEntity.ok(rooms);
    }

    // ─────────────────────────────────────────────────────────────
    // GET /api/rooms/landlord/{landlordId}
    // Get all rooms owned by a specific landlord (Public)
    // ─────────────────────────────────────────────────────────────
    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<RoomResponseDTO>> getRoomsByLandlord(
            @PathVariable Long landlordId) {
        return ResponseEntity.ok(roomService.getRoomsByLandlord(landlordId));
    }
}