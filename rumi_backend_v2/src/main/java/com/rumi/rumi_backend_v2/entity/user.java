package com.rumi.rumi_backend_v2.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="users")
public class User {
    @Id
    @Column(name = "user_id", length = 128)
    private String userId;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, unique = true, length = 20)
    private String phone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(length = 20)
    private String status;

    @Column(name = "profile_completed")
    private Boolean profileCompleted;

    @Column(name = "phone_verified")
    private Boolean phoneVerified;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void applyDefaults() {
        if (userId == null || userId.isBlank()) {
            userId = UUID.randomUUID().toString();
        }
        if (status == null || status.isBlank()) {
            status = "active";
        }
        if (profileCompleted == null) {
            profileCompleted = Boolean.FALSE;
        }
        if (phoneVerified == null) {
            phoneVerified = Boolean.FALSE;
        }
    }
}
