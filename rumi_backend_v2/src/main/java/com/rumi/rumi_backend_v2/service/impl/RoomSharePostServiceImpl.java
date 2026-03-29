package com.rumi.rumi_backend_v2.service.impl;

import com.rumi.rumi_backend_v2.entity.RoomSharePost;
import com.rumi.rumi_backend_v2.repository.RoomSharePostRepository;
import com.rumi.rumi_backend_v2.service.RoomSharePostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomSharePostServiceImpl implements RoomSharePostService {
    private static final Logger log = LoggerFactory.getLogger(RoomSharePostServiceImpl.class);
    private final RoomSharePostRepository roomSharePostRepository;

    @Override
    public RoomSharePost createPost(Map<String, Object> postData) {
        log.info("Creating new room share post");
        
        RoomSharePost post = RoomSharePost.builder()
                .userId((String) postData.get("user_id"))
                .location((String) postData.get("location"))
                .description((String) postData.get("description"))
                .rentPerPerson(((Number) postData.get("rent_per_person")).intValue())
                .genderPreference((String) postData.get("gender_preference"))
                .ageRange((String) postData.get("age_range"))
                .totalRooms(postData.get("total_rooms") != null ? ((Number) postData.get("total_rooms")).intValue() : null)
                .availableRooms(postData.get("available_rooms") != null ? ((Number) postData.get("available_rooms")).intValue() : null)
                .amenities((String) postData.get("amenities"))
                .status((String) postData.getOrDefault("status", "active"))
                .build();
        
        RoomSharePost saved = roomSharePostRepository.save(post);
        log.info("Room share post created successfully with id {}", saved.getId());
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public RoomSharePost getPost(Long id) {
        log.info("Fetching room share post {}", id);
        return roomSharePostRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomSharePost> getAllPosts() {
        log.info("Fetching all active room share posts");
        return roomSharePostRepository.findAllActive();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomSharePost> getUserPosts(String userId) {
        log.info("Fetching room share posts for user {}", userId);
        return roomSharePostRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RoomSharePost> filterPosts(String location, String genderPreference, Integer maxRent, Pageable pageable) {
        log.info("Filtering posts with location={}, genderPreference={}, maxRent={}", location, genderPreference, maxRent);
        return roomSharePostRepository.filterPosts(location, genderPreference, maxRent, pageable);
    }

    @Override
    public RoomSharePost updatePost(Long id, Map<String, Object> updates) {
        log.info("Updating room share post {}", id);
        
        RoomSharePost post = getPost(id);
        
        // Update fields if present in map
        if (updates.containsKey("location")) {
            post.setLocation((String) updates.get("location"));
        }
        if (updates.containsKey("description")) {
            post.setDescription((String) updates.get("description"));
        }
        if (updates.containsKey("rent_per_person")) {
            post.setRentPerPerson(((Number) updates.get("rent_per_person")).intValue());
        }
        if (updates.containsKey("gender_preference")) {
            post.setGenderPreference((String) updates.get("gender_preference"));
        }
        if (updates.containsKey("age_range")) {
            post.setAgeRange((String) updates.get("age_range"));
        }
        if (updates.containsKey("total_rooms")) {
            post.setTotalRooms(((Number) updates.get("total_rooms")).intValue());
        }
        if (updates.containsKey("available_rooms")) {
            post.setAvailableRooms(((Number) updates.get("available_rooms")).intValue());
        }
        if (updates.containsKey("amenities")) {
            post.setAmenities((String) updates.get("amenities"));
        }
        if (updates.containsKey("status")) {
            post.setStatus((String) updates.get("status"));
        }
        
        RoomSharePost updated = roomSharePostRepository.save(post);
        log.info("Room share post {} updated successfully", id);
        return updated;
    }

    @Override
    public void deletePost(Long id) {
        log.info("Deleting room share post {}", id);
        roomSharePostRepository.deleteById(id);
        log.info("Room share post {} deleted", id);
    }
}
