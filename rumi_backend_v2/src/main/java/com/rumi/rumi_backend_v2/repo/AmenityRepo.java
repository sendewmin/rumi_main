package com.rumi.rumi_backend_v2.repo;

import com.rumi.rumi_backend_v2.model.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AmenityRepo extends JpaRepository<Amenity, Long> {
    List<Amenity> findByAmenityIdIn(List<Long> ids);
}
