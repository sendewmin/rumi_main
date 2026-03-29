package com.rumi.rumi_backend_v2.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

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
    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Getter
    @Setter
    @Column(name = "status", nullable = false)
    private String status; // "confirmed", "pending", "cancelled"

    @Getter
    @Setter
    @Column(name = "check_in_date")
    private LocalDateTime checkInDate;

    @Getter
    @Setter
    @Column(name = "check_out_date")
    private LocalDateTime checkOutDate;

    @Getter
    @Setter
    @Column(name = "notes")
    private String notes;

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
