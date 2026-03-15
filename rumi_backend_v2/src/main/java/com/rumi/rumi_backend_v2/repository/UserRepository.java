package com.rumi.rumi_backend_v2.repository;

import com.rumi.rumi_backend_v2.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    // Check if an email is already registered
    boolean existsByEmail(String email);

    // Check if a phone number is already registered
    boolean existsByPhone(String phone);

    // Find a user by their email
    Optional<User> findByEmail(String email);
}
