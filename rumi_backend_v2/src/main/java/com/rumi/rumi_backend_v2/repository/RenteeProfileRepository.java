package com.rumi.rumi_backend_v2.repository;

import com.rumi.rumi_backend_v2.model.RenteeProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RenteeProfileRepository extends JpaRepository<RenteeProfile, String> {
}
