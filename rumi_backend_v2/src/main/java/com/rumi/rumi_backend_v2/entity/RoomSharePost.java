package com.rumi.rumi_backend_v2.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "room_share_post")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomSharePost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Getter
    @Setter
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Getter
    @Setter
    @Column(name = "location", nullable = false)
    private String location;

    @Getter
    @Setter
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Getter
    @Setter
    @Column(name = "rent_per_person", nullable = false)
    private Integer rentPerPerson;

    @Getter
    @Setter
    @Column(name = "gender_preference")
    private String genderPreference; // "MALE", "FEMALE", "ANY"

    @Getter
    @Setter
    @Column(name = "age_range")
    private String ageRange;

    @Getter
    @Setter
    @Column(name = "available_from")
    private LocalDateTime availableFrom;

    @Getter
    @Setter
    @Column(name = "total_rooms")
    private Integer totalRooms;

    @Getter
    @Setter
    @Column(name = "available_rooms")
    private Integer availableRooms;

    @Getter
    @Setter
    @Column(name = "amenities", columnDefinition = "TEXT")
    private String amenities; // JSON array as string

    @Getter
    @Setter
    @Column(name = "status")
    private String status; // "active", "inactive", "closed"

    @Getter
    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Getter
    @Setter
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
