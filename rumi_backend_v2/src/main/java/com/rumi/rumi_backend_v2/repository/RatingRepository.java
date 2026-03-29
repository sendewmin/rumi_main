package com.rumi.rumi_backend_v2.repository;

import com.rumi.rumi_backend_v2.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserIdAndRoomId(String userId, Long roomId);
    List<Rating> findByRoomId(Long roomId);
    List<Rating> findByUserId(String userId);
    boolean existsByUserIdAndRoomId(String userId, Long roomId);

    @Query("SELECT AVG(r.stars) FROM Rating r WHERE r.roomId = :roomId")
    Double getAverageRatingByRoomId(@Param("roomId") Long roomId);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.roomId = :roomId")
    Long countRatingsByRoomId(@Param("roomId") Long roomId);
}
