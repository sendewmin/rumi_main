package com.rumi.rumi_backend_v2.service;

import com.rumi.rumi_backend_v2.entity.Wishlist;
import java.util.List;

public interface WishlistService {
    Wishlist addToWishlist(String userId, Long roomId);
    void removeFromWishlist(String userId, Long roomId);
    boolean isInWishlist(String userId, Long roomId);
    List<Wishlist> getUserWishlists(String userId);
    Wishlist getWishlistItem(Long id);
}
