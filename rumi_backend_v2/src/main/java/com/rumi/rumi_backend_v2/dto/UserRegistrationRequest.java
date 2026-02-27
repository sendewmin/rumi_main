package com.rumi.rumi_backend_v2.dto;

import lombok.Data;

/**
 * Sent by the frontend when a new user registers for the first time.
 *
 * The firebaseUid is the unique ID returned by Firebase after the user
 * signs up with Firebase Auth (email/password, Google, or phone).
 *
 * Role choices: "rentee" (looking for a room) or "renter" (listing a room)
 */
@Data
public class UserRegistrationRequest {

    private String firebaseUid;   // Firebase UID from Firebase Auth
    private String fullName;
    private String email;
    private String phone;
    private String role;          // "rentee" or "renter"
}
