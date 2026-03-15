package com.rumi.rumi_backend_v2.controller;

import com.rumi.rumi_backend_v2.dto.UserRegistrationRequest;
import com.rumi.rumi_backend_v2.dto.UserResponse;
import com.rumi.rumi_backend_v2.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * POST /api/users/register
     *
     * Called by the frontend after a successful Firebase Auth sign-up.
     * Body example:
     * {
     *   "firebaseUid": "abc123xyz",
     *   "fullName":    "Jane Doe",
     *   "email":       "jane@example.com",
     *   "phone":       "+60123456789",
     *   "role":        "rentee"
     * }
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationRequest request) {
        try {
            UserResponse response = userService.registerUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * GET /api/users/{uid}
     *
     * Fetch a single user's profile by their Firebase UID.
     */
    @GetMapping("/{uid}")
    public ResponseEntity<?> getUser(@PathVariable String uid) {
        try {
            UserResponse response = userService.getUserById(uid);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * GET /api/users
     *
     * Fetch all registered users. Useful for admin dashboard.
     */
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
