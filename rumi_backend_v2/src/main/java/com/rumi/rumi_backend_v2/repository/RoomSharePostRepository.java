package com.rumi.rumi_backend_v2.repository;

import com.rumi.rumi_backend_v2.entity.RoomSharePost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomSharePostRepository extends JpaRepository<RoomSharePost, Long> {
    List<RoomSharePost> findByUserId(String userId);
    List<RoomSharePost> findByStatus(String status);

    @Query("SELECT r FROM RoomSharePost r WHERE " +
            "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:genderPreference IS NULL OR r.genderPreference = :genderPreference) AND " +
            "(:maxRent IS NULL OR r.rentPerPerson <= :maxRent) AND " +
            "r.status = 'active'")
    Page<RoomSharePost> filterPosts(
            @Param("location") String location,
            @Param("genderPreference") String genderPreference,
            @Param("maxRent") Integer maxRent,
            Pageable pageable);

    @Query("SELECT r FROM RoomSharePost r WHERE r.status = 'active' ORDER BY r.createdAt DESC")
    List<RoomSharePost> findAllActive();
}
