package com.rumi.rumi_backend_v2.service;

import com.rumi.rumi_backend_v2.enums.UserStatus;
import org.springframework.data.domain.Page;

public interface UserService {
    Page<?> getAllUsers(int page, int size, String authHeader);
    void banUser(String userId, String authHeader);
    void unbanUser(String userId, String authHeader);
    void createOrUpdateAdminUser(String authHeader);
}
