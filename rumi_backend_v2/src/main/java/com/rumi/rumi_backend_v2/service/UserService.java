package com.rumi.rumi_backend_v2.service;

import com.rumi.rumi_backend_v2.dto.UserRegistrationRequest;
import com.rumi.rumi_backend_v2.dto.UserResponse;
import com.rumi.rumi_backend_v2.model.Role;
import com.rumi.rumi_backend_v2.model.User;
import com.rumi.rumi_backend_v2.repository.RoleRepository;
import com.rumi.rumi_backend_v2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    // ─── Register ─────────────────────────────────────────────────────────────

    /**
     * Called after Firebase Auth succeeds on the frontend.
     * Saves the user metadata (name, email, phone, role) in MySQL.
     * The firebaseUid becomes the MySQL primary key so both systems stay in sync.
     */
    @Transactional
    public UserResponse registerUser(UserRegistrationRequest request) {

        // 1 — Prevent duplicate registrations
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Phone already registered: " + request.getPhone());
        }

        // 2 — Resolve the role from the roles table (seeded by Flyway V2)
        Role role = roleRepository.findByRoleName(request.getRole())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid role: " + request.getRole() + ". Valid values: rentee, renter"
                ));

        // 3 — Build and save the User entity
        User user = new User();
        user.setUserId(request.getFirebaseUid());   // Firebase UID as PK
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(role);

        User saved = userRepository.save(user);
        log.info("Registered new user: uid={} role={}", saved.getUserId(), role.getRoleName());

        return toResponse(saved);
    }

    // ─── Fetch single user ────────────────────────────────────────────────────

    /**
     * Looks up a user by their Firebase UID.
     */
    @Transactional(readOnly = true)
    public UserResponse getUserById(String firebaseUid) {
        User user = userRepository.findById(firebaseUid)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + firebaseUid));
        return toResponse(user);
    }

    // ─── Fetch all users ──────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ─── Mapper ───────────────────────────────────────────────────────────────

    private UserResponse toResponse(User user) {
        UserResponse resp = new UserResponse();
        resp.setUserId(user.getUserId());
        resp.setFullName(user.getFullName());
        resp.setEmail(user.getEmail());
        resp.setPhone(user.getPhone());
        resp.setRole(user.getRole().getRoleName());
        resp.setStatus(user.getStatus().name());
        resp.setProfileCompleted(user.getProfileCompleted());
        resp.setPhoneVerified(user.getPhoneVerified());
        resp.setCreatedAt(user.getCreatedAt());
        return resp;
    }
}
