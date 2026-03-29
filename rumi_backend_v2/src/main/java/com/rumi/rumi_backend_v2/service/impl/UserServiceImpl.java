package com.rumi.rumi_backend_v2.service.impl;

import com.rumi.rumi_backend_v2.dto.UserDTO;
import com.rumi.rumi_backend_v2.entity.User;
import com.rumi.rumi_backend_v2.enums.RoleName;
import com.rumi.rumi_backend_v2.enums.UserStatus;
import com.rumi.rumi_backend_v2.repo.UserRepo;
import com.rumi.rumi_backend_v2.service.UserService;
import com.rumi.rumi_backend_v2.util.SupabaseAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepo userRepo;
    private final SupabaseAuthService supabaseAuthService;

    private void verifyAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing authorization header");
        }
        String userId = supabaseAuthService.getUserId(authHeader);
        User admin = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "User not found"));
        if (admin.getRole() != RoleName.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }
    }

    private UserDTO buildUserDTO(User user) {
        return UserDTO.builder()
                .userId(user.getSupabaseUid())
                .fullName(user.getFull_name())
                .email(user.getEmail())
                .phoneNumber(user.getPhone_number())
                .role(user.getRole())
                .status(user.getStatus())
                .profileComplete(user.isProfile_complete())
                .phoneVerified(user.isPhone_verified())
                .createdDate(user.getCreatedDate())
                .build();
    }

    @Override
    public Page<?> getAllUsers(int page, int size, String authHeader) {
        verifyAdmin(authHeader);
        log.info("Admin fetching all users - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        return userRepo.findAll(pageable).map(this::buildUserDTO);
    }

    @Override
    @Transactional
    public void banUser(String userId, String authHeader) {
        verifyAdmin(authHeader);
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (user.getRole() == RoleName.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot ban admin users");
        }
        user.setStatus(UserStatus.SUSPENDED);
        userRepo.save(user);
        log.info("User {} banned by admin", userId);
    }

    @Override
    @Transactional
    public void unbanUser(String userId, String authHeader) {
        verifyAdmin(authHeader);
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setStatus(UserStatus.ACTIVE);
        userRepo.save(user);
        log.info("User {} unbanned by admin", userId);
    }

    @Override
    @Transactional
    public void createOrUpdateAdminUser(String authHeader) {
        try {
            String userId = supabaseAuthService.getUserId(authHeader);
            String userEmail = supabaseAuthService.getUserEmail(authHeader);
            
            log.info("Creating/updating admin user: {}", userId);
            
            User user = userRepo.findById(userId).orElseGet(() -> {
                // Create new user
                return User.builder()
                        .supabaseUid(userId)
                        .email(userEmail)
                        .full_name("admin")
                        .phone_number("0000000000")
                        .role(RoleName.ADMIN)
                        .status(UserStatus.ACTIVE)
                        .profile_complete(true)
                        .phone_verified(false)
                        .build();
            });
            
            // Update existing user to ensure admin role
            user.setRole(RoleName.ADMIN);
            user.setStatus(UserStatus.ACTIVE);
            user.setEmail(userEmail);
            
            userRepo.save(user);
            log.info("Admin user {} created/updated successfully", userId);
        } catch (Exception e) {
            log.error("Error creating/updating admin user: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to setup admin user: " + e.getMessage());
        }
    }
}
