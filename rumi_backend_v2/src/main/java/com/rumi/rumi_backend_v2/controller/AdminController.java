package com.rumi.rumi_backend_v2.controller;

import com.rumi.rumi_backend_v2.dto.RoomDetailResponse;
import com.rumi.rumi_backend_v2.entity.RoomDetail;
import com.rumi.rumi_backend_v2.enums.ApprovalStatus;
import com.rumi.rumi_backend_v2.service.AdminService;
import com.rumi.rumi_backend_v2.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminController {
    private final AdminService adminService;
    private final UserService userService;
    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    /**
     * Get all pending listings for review (admin only)
     */
    @GetMapping("/listings/pending")
    public ResponseEntity<?> getPendingListings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "Authorization") String authHeader) {
        try {
            log.info("Fetching pending listings - page: {}, size: {}", page, size);
            Page<RoomDetailResponse> pendingListings = adminService.getPendingListings(page, size, authHeader);
            return ResponseEntity.ok(pendingListings);
        } catch (Exception e) {
            log.error("Failed to fetch pending listings: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch pending listings"));
        }
    }

    /**
     * Approve a listing (admin only)
     */
    @PutMapping("/listings/{roomId}/approve")
    public ResponseEntity<?> approveListing(
            @PathVariable Long roomId,
            @RequestHeader(value = "Authorization") String authHeader) {
        try {
            log.info("Approving listing with ID: {}", roomId);
            adminService.approveListing(roomId, authHeader);
            return ResponseEntity.ok(Map.of("message", "Listing approved successfully", "roomId", roomId));
        } catch (IllegalArgumentException e) {
            log.warn("Approval failed - invalid argument: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Failed to approve listing {}: {}", roomId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to approve listing"));
        }
    }

    /**
     * Reject a listing (admin only)
     */
    @PutMapping("/listings/{roomId}/reject")
    public ResponseEntity<?> rejectListing(
            @PathVariable Long roomId,
            @RequestBody Map<String, String> requestBody,
            @RequestHeader(value = "Authorization") String authHeader) {
        try {
            String reason = requestBody.getOrDefault("reason", "No reason provided");
            log.info("Rejecting listing with ID: {} - Reason: {}", roomId, reason);
            adminService.rejectListing(roomId, reason, authHeader);
            return ResponseEntity.ok(Map.of(
                "message", "Listing rejected successfully",
                "roomId", roomId,
                "reason", reason
            ));
        } catch (IllegalArgumentException e) {
            log.warn("Rejection failed - invalid argument: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Failed to reject listing {}: {}", roomId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to reject listing"));
        }
    }

    /**
     * Get all listings with approval status (admin only)
     */
    @GetMapping("/listings")
    public ResponseEntity<?> getAllListingsWithStatus(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestHeader(value = "Authorization") String authHeader) {
        try {
            log.info("Fetching listings with status filter - page: {}, size: {}, status: {}", page, size, status);
            Page<RoomDetailResponse> listings = adminService.getListingsWithStatus(page, size, status, authHeader);
            return ResponseEntity.ok(listings);
        } catch (Exception e) {
            log.error("Failed to fetch listings: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch listings"));
        }
    }

    /**
     * Get approval statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<?> getApprovalStatistics(
            @RequestHeader(value = "Authorization") String authHeader) {
        try {
            log.info("Fetching approval statistics");
            Map<String, Long> stats = adminService.getApprovalStatistics(authHeader);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Failed to fetch statistics: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch statistics"));
        }
    }

    /**
     * Get all users (admin only)
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "Authorization") String authHeader) {
        try {
            log.info("Fetching all users - page: {}, size: {}", page, size);
            Page<?> users = userService.getAllUsers(page, size, authHeader);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Failed to fetch users: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch users"));
        }
    }

    /**
     * Ban a user (admin only)
     */
    @PutMapping("/users/{userId}/ban")
    public ResponseEntity<?> banUser(
            @PathVariable String userId,
            @RequestHeader(value = "Authorization") String authHeader) {
        try {
            log.info("Banning user with ID: {}", userId);
            userService.banUser(userId, authHeader);
            return ResponseEntity.ok(Map.of("message", "User banned successfully", "userId", userId));
        } catch (Exception e) {
            log.error("Failed to ban user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to ban user"));
        }
    }

    /**
     * Unban a user (admin only)
     */
    @PutMapping("/users/{userId}/unban")
    public ResponseEntity<?> unbanUser(
            @PathVariable String userId,
            @RequestHeader(value = "Authorization") String authHeader) {
        try {
            log.info("Unbanning user with ID: {}", userId);
            userService.unbanUser(userId, authHeader);
            return ResponseEntity.ok(Map.of("message", "User unbanned successfully", "userId", userId));
        } catch (Exception e) {
            log.error("Failed to unban user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to unban user"));
        }
    }

    /**
     * Setup endpoint to create admin user from Supabase token (one-time setup)
     */
    @PostMapping("/setup/create-admin-user")
    public ResponseEntity<?> setupAdminUser(
            @RequestHeader(value = "Authorization") String authHeader) {
        try {
            log.info("Setting up admin user from Supabase token");
            userService.createOrUpdateAdminUser(authHeader);
            return ResponseEntity.ok(Map.of("message", "Admin user created/updated successfully"));
        } catch (Exception e) {
            log.error("Failed to setup admin user: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to setup admin user: " + e.getMessage()));
        }
    }
}
