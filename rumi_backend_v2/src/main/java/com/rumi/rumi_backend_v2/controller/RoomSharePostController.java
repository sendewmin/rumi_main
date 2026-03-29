package com.rumi.rumi_backend_v2.controller;

import com.rumi.rumi_backend_v2.entity.RoomSharePost;
import com.rumi.rumi_backend_v2.service.RoomSharePostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

@RestController
@RequestMapping("/api/room-share-posts")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RoomSharePostController {
    private static final Logger log = LoggerFactory.getLogger(RoomSharePostController.class);
    
    @Autowired
    private RoomSharePostService roomSharePostService;

    /**
     * Get all room share posts
     */
    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        try {
            return ResponseEntity.ok(roomSharePostService.getAllPosts());
        } catch (Exception e) {
            log.error("Error fetching posts: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch posts"));
        }
    }

    /**
     * Create a new room share post
     */
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Map<String, Object> request) {
        try {
            RoomSharePost post = roomSharePostService.createPost(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(post);
        } catch (Exception e) {
            log.error("Error creating post: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to create post"));
        }
    }

    /**
     * Filter room share posts
     */
    @GetMapping("/filter")
    public ResponseEntity<?> filterPosts(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String genderPreference,
            @RequestParam(required = false) Integer maxRent,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            return ResponseEntity.ok(roomSharePostService.filterPosts(location, genderPreference, maxRent, pageable));
        } catch (Exception e) {
            log.error("Error filtering posts: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to filter posts"));
        }
    }

    /**
     * Get a specific post
     */
    @GetMapping("/{postId}")
    public ResponseEntity<?> getPost(@PathVariable Long postId) {
        try {
            RoomSharePost post = roomSharePostService.getPost(postId);
            log.info("Fetched post {}", postId);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            log.error("Error fetching post: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch post"));
        }
    }

    /**
     * Update a room share post
     */
    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable Long postId, @RequestBody Map<String, Object> request) {
        try {
            RoomSharePost updatedPost = roomSharePostService.updatePost(postId, request);
            log.info("Updated post {}", postId);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            log.error("Error updating post: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update post"));
        }
    }

    /**
     * Delete a room share post
     */
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        try {
            roomSharePostService.deletePost(postId);
            log.info("Deleted post {}", postId);
            return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting post: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to delete post"));
        }
    }
}
