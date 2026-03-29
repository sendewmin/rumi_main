package com.rumi.rumi_backend_v2.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "wishlist", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "room_id"}))
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wishlist {

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
    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
