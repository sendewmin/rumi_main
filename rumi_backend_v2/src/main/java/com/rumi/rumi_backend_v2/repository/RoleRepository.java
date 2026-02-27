package com.rumi.rumi_backend_v2.repository;

import com.rumi.rumi_backend_v2.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    // Find a role by its name — used when assigning roles during registration
    Optional<Role> findByRoleName(String roleName);
}
