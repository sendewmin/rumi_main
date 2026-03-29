package com.rumi.rumi_backend_v2.service.impl;

import com.rumi.rumi_backend_v2.entity.Rating;
import com.rumi.rumi_backend_v2.repository.RatingRepository;
import com.rumi.rumi_backend_v2.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class RatingServiceImpl implements RatingService {
    private static final Logger log = LoggerFactory.getLogger(RatingServiceImpl.class);
    private final RatingRepository ratingRepository;

    @Override
    public Rating submitRating(String userId, Long roomId, Integer stars, String tags, String comment) {
        log.info("Submitting rating for user {} on room {} with {} stars", userId, roomId, stars);
        
        // Validate star rating
        if (stars < 1 || stars > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5 stars");
        }

        // Check if user has already rated this room
        if (hasUserRated(userId, roomId)) {
            log.warn("User {} has already rated room {}", userId, roomId);
            throw new IllegalArgumentException("You have already rated this room");
        }

        Rating rating = Rating.builder()
                .userId(userId)
                .roomId(roomId)
                .stars(stars)
                .tags(tags)
                .comment(comment)
                .build();
        
        Rating saved = ratingRepository.save(rating);
        log.info("Rating submitted successfully with id {} for room {}", saved.getId(), roomId);
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasUserRated(String userId, Long roomId) {
        return ratingRepository.existsByUserIdAndRoomId(userId, roomId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Rating> getRoomRatings(Long roomId) {
        log.info("Fetching ratings for room {}", roomId);
        return ratingRepository.findByRoomId(roomId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Rating> getUserRatings(String userId) {
        log.info("Fetching ratings from user {}", userId);
        return ratingRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Rating getRating(Long id) {
        return ratingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rating not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getRoomRatingStats(Long roomId) {
        log.info("Calculating rating stats for room {}", roomId);
        
        List<Rating> ratings = ratingRepository.findByRoomId(roomId);
        Map<String, Object> stats = new HashMap<>();
        
        if (ratings.isEmpty()) {
            stats.put("average", 0.0);
            stats.put("total", 0);
            stats.put("distribution", new HashMap<Integer, Integer>());
            return stats;
        }

        // Calculate average
        double average = ratings.stream()
                .mapToInt(Rating::getStars)
                .average()
                .orElse(0.0);
        
        // Calculate distribution
        Map<Integer, Integer> distribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            final int starRating = i;
            int count = (int) ratings.stream()
                    .filter(r -> r.getStars() == starRating)
                    .count();
            distribution.put(i, count);
        }

        stats.put("average", Math.round(average * 10.0) / 10.0); // Round to 1 decimal
        stats.put("total", ratings.size());
        stats.put("distribution", distribution);
        
        return stats;
    }

    @Override
    public void deleteRating(Long id) {
        log.info("Deleting rating {}", id);
        ratingRepository.deleteById(id);
        log.info("Rating {} deleted", id);
    }
}
