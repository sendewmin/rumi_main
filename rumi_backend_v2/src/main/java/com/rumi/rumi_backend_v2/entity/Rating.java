package com.rumi.rumi_backend_v2.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "rating", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "room_id"}))
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rating {

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
    @Column(name = "stars", nullable = false)
    private Integer stars; // 1-5

    @Getter
    @Setter
    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Getter
    @Setter
    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags; // JSON array as string

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
