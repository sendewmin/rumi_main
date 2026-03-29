package com.rumi.rumi_backend_v2.service;

import com.rumi.rumi_backend_v2.entity.RoomSharePost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Map;

public interface RoomSharePostService {
    RoomSharePost createPost(Map<String, Object> postData);
    RoomSharePost getPost(Long id);
    List<RoomSharePost> getAllPosts();
    List<RoomSharePost> getUserPosts(String userId);
    Page<RoomSharePost> filterPosts(String location, String genderPreference, Integer maxRent, Pageable pageable);
    RoomSharePost updatePost(Long id, Map<String, Object> updates);
    void deletePost(Long id);
}
