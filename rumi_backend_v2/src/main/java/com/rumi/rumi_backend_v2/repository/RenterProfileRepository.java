package com.rumi.rumi_backend_v2.repository;

import com.rumi.rumi_backend_v2.model.RenterProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RenterProfileRepository extends JpaRepository<RenterProfile, String> {
}
