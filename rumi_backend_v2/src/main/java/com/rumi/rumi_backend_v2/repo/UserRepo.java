package com.rumi.rumi_backend_v2.repo;

import com.rumi.rumi_backend_v2.entity.User;
import com.rumi.rumi_backend_v2.enums.RoleName;
import com.rumi.rumi_backend_v2.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends JpaRepository<User, String> {
    Page<User> findByRole(RoleName role, Pageable pageable);
    Page<User> findByStatus(UserStatus status, Pageable pageable);
    Page<User> findByRoleAndStatus(RoleName role, UserStatus status, Pageable pageable);
    List<User> findAll();
}
