package com.rumi.rumi_backend_v2.repository;

import com.rumi.rumi_backend_v2.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByUserIdAndRoomId(String userId, Long roomId);
    List<Wishlist> findByUserId(String userId);
    void deleteByUserIdAndRoomId(String userId, Long roomId);
    boolean existsByUserIdAndRoomId(String userId, Long roomId);
}
