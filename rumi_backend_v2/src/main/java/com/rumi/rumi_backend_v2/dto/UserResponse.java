package com.rumi.rumi_backend_v2.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * Returned to the frontend after a successful registration or profile fetch.
 * Never exposes internal database IDs beyond what is needed.
 */
@Data
public class UserResponse {

    private String userId;            // Firebase UID
    private String fullName;
    private String email;
    private String phone;
    private String role;              // "rentee" | "renter" | "admin"
    private String status;            // "active" | "inactive" | "banned"
    private Boolean profileCompleted;
    private Boolean phoneVerified;
    private LocalDateTime createdAt;
}
