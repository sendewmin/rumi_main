package com.rumi.rumi_backend_v2.repo;

import com.rumi.rumi_backend_v2.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AmenityRepo extends JpaRepository<Amenity, Long> {
    List<Amenity> findByAmenityIdIn(List<Long> ids);
}
