package com.rumi.rumi_backend_v2.controller;

import com.rumi.rumi_backend_v2.entity.Wishlist;
import com.rumi.rumi_backend_v2.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlists")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class WishlistController {
    private static final Logger log = LoggerFactory.getLogger(WishlistController.class);
    
    @Autowired
    private WishlistService wishlistService;

    @PostMapping
    public ResponseEntity<?> addToWishlist(@RequestBody Map<String, Object> request) {
        try {
            String userId = (String) request.get("user_id");
            Long roomId = ((Number) request.get("room_id")).longValue();

            if (userId == null || roomId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing user_id or room_id"));
            }

            Wishlist wishlist = wishlistService.addToWishlist(userId, roomId);
            return ResponseEntity.status(HttpStatus.CREATED).body(wishlist);
        } catch (Exception e) {
            log.error("Error adding to wishlist: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to add room to wishlist"));
        }
    }

    /**
     * Remove a room from user's wishlist
     */
    @DeleteMapping("/{userId}/{roomId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable String userId, @PathVariable Long roomId) {
        try {
            wishlistService.removeFromWishlist(userId, roomId);
            return ResponseEntity.ok(Map.of("message", "Room removed from wishlist"));
        } catch (Exception e) {
            log.error("Error removing from wishlist: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to remove room from wishlist"));
        }
    }

    /**
     * Check if a room is in user's wishlist
     */
    @GetMapping("/{userId}/{roomId}/exists")
    public ResponseEntity<?> isInWishlist(@PathVariable String userId, @PathVariable Long roomId) {
        try {
            boolean exists = wishlistService.isInWishlist(userId, roomId);
            return ResponseEntity.ok(Map.of("exists", exists));
        } catch (Exception e) {
            log.error("Error checking wishlist: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to check wishlist"));
        }
    }

    /**
     * Get all wishlisted rooms for a user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserWishlists(@PathVariable String userId) {
        try {
            return ResponseEntity.ok(wishlistService.getUserWishlists(userId));
        } catch (Exception e) {
            log.error("Error fetching wishlists: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch wishlists"));
        }
    }
}
