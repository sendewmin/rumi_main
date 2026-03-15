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

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('LANDLORD')")   
    public ResponseEntity<Room> createRoom(@RequestBody RoomRequest request,
                                           Principal principal) {
        
        Long landlordId = extractLandlordId(principal);
        Room created = roomService.createRoom(request, landlordId);
        return ResponseEntity.ok(created);
    }

    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id,
                                           @RequestBody RoomRequest request,
                                           Principal principal) {
        Long landlordId = extractLandlordId(principal);
        Room updated = roomService.updateRoom(id, request, landlordId);
        return ResponseEntity.ok(updated);
    }

    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<String> deleteRoom(@PathVariable Long id,
                                              Principal principal) {
        Long landlordId = extractLandlordId(principal);
        roomService.deleteRoom(id, landlordId);
        return ResponseEntity.ok("Room deleted successfully.");
    }

    
    private Long extractLandlordId(Principal principal) {
    
        try {
            return Long.parseLong(principal.getName());
        } catch (NumberFormatException e) {
            throw new RuntimeException("Could not resolve landlord ID from token. Coordinate with Member 3.");
        }
    }
}