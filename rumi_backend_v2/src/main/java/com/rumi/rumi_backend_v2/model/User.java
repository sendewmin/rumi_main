package com.rumi.rumi_backend_v2.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    // Firebase UID becomes the primary key — same VARCHAR(128) as in V3 migration
    @Id
    @Column(name = "user_id", length = 128)
    private String userId;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "phone", nullable = false, unique = true, length = 20)
    private String phone;

    // Many users share one role — loaded eagerly so we always know the role
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "ENUM('active','inactive','banned') DEFAULT 'active'")
    private UserStatus status = UserStatus.active;

    @Column(name = "profile_completed")
    private Boolean profileCompleted = false;

    @Column(name = "phone_verified")
    private Boolean phoneVerified = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum UserStatus {
        active, inactive, banned
    }
}
