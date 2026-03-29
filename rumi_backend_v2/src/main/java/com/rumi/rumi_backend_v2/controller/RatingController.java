package com.rumi.rumi_backend_v2.controller;

import com.rumi.rumi_backend_v2.entity.Rating;
import com.rumi.rumi_backend_v2.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RatingController {
    private static final Logger log = LoggerFactory.getLogger(RatingController.class);
    
    @Autowired
    private RatingService ratingService;

    /**
     * Submit a rating for a room
     */
    @PostMapping
    public ResponseEntity<?> submitRating(@RequestBody Map<String, Object> request) {
        try {
            String userId = (String) request.get("user_id");
            Long roomId = ((Number) request.get("room_id")).longValue();
            Integer stars = ((Number) request.get("stars")).intValue();
            String comment = (String) request.get("comment");
            String tags = (String) request.get("tags");

            if (userId == null || roomId == null || stars == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }

            Rating rating = ratingService.submitRating(userId, roomId, stars, tags, comment);
            return ResponseEntity.status(HttpStatus.CREATED).body(rating);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error submitting rating: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to submit rating"));
        }
    }

    /**
     * Check if user has already rated a room
     */
    @GetMapping("/check/{userId}/{roomId}")
    public ResponseEntity<?> hasUserRated(@PathVariable String userId, @PathVariable Long roomId) {
        try {
            boolean exists = ratingService.hasUserRated(userId, roomId);
            return ResponseEntity.ok(Map.of("exists", exists));
        } catch (Exception e) {
            log.error("Error checking rating: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to check rating"));
        }
    }

    /**
     * Get all ratings for a room
     */
    @GetMapping("/room/{roomId}")
    public ResponseEntity<?> getRoomRatings(@PathVariable Long roomId) {
        try {
            return ResponseEntity.ok(ratingService.getRoomRatings(roomId));
        } catch (Exception e) {
            log.error("Error fetching ratings: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch ratings"));
        }
    }

    /**
     * Get rating statistics for a room
     */
    @GetMapping("/room/{roomId}/stats")
    public ResponseEntity<?> getRoomRatingStats(@PathVariable Long roomId) {
        try {
            return ResponseEntity.ok(ratingService.getRoomRatingStats(roomId));
        } catch (Exception e) {
            log.error("Error fetching rating stats: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch rating stats"));
        }
    }

    /**
     * Get all reviews for a room
     */
    @GetMapping("/room/{roomId}/reviews")
    public ResponseEntity<?> getRoomReviews(@PathVariable Long roomId) {
        try {
            return ResponseEntity.ok(ratingService.getRoomRatings(roomId));
        } catch (Exception e) {
            log.error("Error fetching reviews: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch reviews"));
        }
    }
}
