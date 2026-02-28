package com.rumi.controller;

import com.rumi.dto.RoomRequest;
import com.rumi.entity.Room;
import com.rumi.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    // ─── PUBLIC: Anyone can view all listings ─────────────────────────────────
    // GET http://localhost:8080/api/rooms
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    // ─── PUBLIC: Get a single room by ID ─────────────────────────────────────
    // GET http://localhost:8080/api/rooms/1
    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    // ─── LANDLORD ONLY: Create a new room listing ─────────────────────────────
    // POST http://localhost:8080/api/rooms
    // Body (JSON): { "title": "...", "description": "...", "rent": 500.0, "location": "..." }
    @PostMapping
    @PreAuthorize("hasRole('LANDLORD')")   // Only landlords can create listings
    public ResponseEntity<Room> createRoom(@RequestBody RoomRequest request,
                                           Principal principal) {
        // principal.getName() gives us the logged-in user's username/ID
        // NOTE: Coordinate with Member 2 on how to extract the landlord's ID from JWT
        Long landlordId = extractLandlordId(principal);
        Room created = roomService.createRoom(request, landlordId);
        return ResponseEntity.ok(created);
    }

    // ─── LANDLORD ONLY: Update an existing room listing ──────────────────────
    // PUT http://localhost:8080/api/rooms/1
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id,
                                           @RequestBody RoomRequest request,
                                           Principal principal) {
        Long landlordId = extractLandlordId(principal);
        Room updated = roomService.updateRoom(id, request, landlordId);
        return ResponseEntity.ok(updated);
    }

    // ─── LANDLORD ONLY: Delete a room listing ────────────────────────────────
    // DELETE http://localhost:8080/api/rooms/1
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<String> deleteRoom(@PathVariable Long id,
                                              Principal principal) {
        Long landlordId = extractLandlordId(principal);
        roomService.deleteRoom(id, landlordId);
        return ResponseEntity.ok("Room deleted successfully.");
    }

    // ─── Helper: Extract landlord ID from JWT principal ──────────────────────
    // ⚠️ IMPORTANT: Coordinate with Member 3 (Authentication) on this method.
    // Member 3 will set the user ID inside the JWT token.
    // This is a placeholder — replace with actual JWT parsing once Member 3's code is ready.
    private Long extractLandlordId(Principal principal) {
        // Temporary: assumes username IS the landlordId (as a number string)
        // Replace this after Member 3 integrates JWT with user ID claims
        try {
            return Long.parseLong(principal.getName());
        } catch (NumberFormatException e) {
            throw new RuntimeException("Could not resolve landlord ID from token. Coordinate with Member 3.");
        }
    }
}