package com.rumi.rumi_backend_v2.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "rentee_profiles")
public class RenteeProfile {

    // Shares the same PK as users — one-to-one relationship
    @Id
    @Column(name = "user_id", length = 128)
    private String userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "preferred_location", length = 255)
    private String preferredLocation;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", columnDefinition = "ENUM('male','female','other')")
    private Gender gender;

    @Column(name = "date_of_birth")
    private java.time.LocalDate dateOfBirth;

    public enum Gender {
        male, female, other
    }
}
