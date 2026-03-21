package com.rumi.rumi_backend_v2.controller;

import com.rumi.rumi_backend_v2.dto.RoomCreateRequest;
import com.rumi.rumi_backend_v2.dto.RoomDetailResponse;
import com.rumi.rumi_backend_v2.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;
    private static final Logger log = LoggerFactory.getLogger(RoomController.class);

    @PostMapping
    public ResponseEntity<?> createRoom(@Valid @RequestBody RoomCreateRequest request,
                                        @RequestHeader("Authorization") String authHeader) {
        try {
            Long roomId = roomService.createRoom(request, authHeader);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("roomId", roomId));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("error", e.getReason()));
        } catch (Exception e) {
            log.error("Room creation failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Room creation failed"));
        }
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable Long roomId) {
        try {
            RoomDetailResponse response = roomService.getRoom(roomId);
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("error", e.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to fetch room details"));
        }
    }
}
