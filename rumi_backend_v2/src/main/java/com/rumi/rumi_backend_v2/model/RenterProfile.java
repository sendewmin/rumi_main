package com.rumi.rumi_backend_v2.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "renter_profiles")
public class RenterProfile {

    // Shares the same PK as users — one-to-one relationship
    @Id
    @Column(name = "user_id", length = 128)
    private String userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "location", length = 255)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", columnDefinition = "ENUM('male','female','other')")
    private Gender gender;

    public enum Gender {
        male, female, other
    }
}
