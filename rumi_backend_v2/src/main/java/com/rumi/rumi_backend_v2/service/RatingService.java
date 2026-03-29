package com.rumi.rumi_backend_v2.service;

import com.rumi.rumi_backend_v2.entity.Rating;
import java.util.List;
import java.util.Map;

public interface RatingService {
    Rating submitRating(String userId, Long roomId, Integer stars, String tags, String comment);
    boolean hasUserRated(String userId, Long roomId);
    List<Rating> getRoomRatings(Long roomId);
    List<Rating> getUserRatings(String userId);
    Rating getRating(Long id);
    Map<String, Object> getRoomRatingStats(Long roomId);
    void deleteRating(Long id);
}
