package com.rumi.rumi_backend_v2.service.impl;

import com.rumi.rumi_backend_v2.entity.Wishlist;
import com.rumi.rumi_backend_v2.repository.WishlistRepository;
import com.rumi.rumi_backend_v2.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistServiceImpl implements WishlistService {
    private static final Logger log = LoggerFactory.getLogger(WishlistServiceImpl.class);
    private final WishlistRepository wishlistRepository;

    @Override
    public Wishlist addToWishlist(String userId, Long roomId) {
        log.info("Adding room {} to wishlist for user {}", roomId, userId);
        
        // Check if already exists
        if (wishlistRepository.existsByUserIdAndRoomId(userId, roomId)) {
            log.warn("Room {} is already in wishlist for user {}", roomId, userId);
            return wishlistRepository.findByUserIdAndRoomId(userId, roomId).get();
        }

        Wishlist wishlist = Wishlist.builder()
                .userId(userId)
                .roomId(roomId)
                .build();
        
        Wishlist saved = wishlistRepository.save(wishlist);
        log.info("Room {} added to wishlist for user {}", roomId, userId);
        return saved;
    }

    @Override
    public void removeFromWishlist(String userId, Long roomId) {
        log.info("Removing room {} from wishlist for user {}", roomId, userId);
        wishlistRepository.deleteByUserIdAndRoomId(userId, roomId);
        log.info("Room {} removed from wishlist for user {}", roomId, userId);
    }

    @Override
    public boolean isInWishlist(String userId, Long roomId) {
        return wishlistRepository.existsByUserIdAndRoomId(userId, roomId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Wishlist> getUserWishlists(String userId) {
        log.info("Fetching wishlists for user {}", userId);
        return wishlistRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Wishlist getWishlistItem(Long id) {
        return wishlistRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Wishlist item not found with id: " + id));
    }
}
