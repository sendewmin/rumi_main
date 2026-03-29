package com.rumi.rumi_backend_v2.repo;

import com.rumi.rumi_backend_v2.entity.RoomDetail;
import com.rumi.rumi_backend_v2.enums.VerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepo extends JpaRepository<RoomDetail, Long> {
    RoomDetail findByRoomId(Long roomId);
    List<RoomDetail> findByRenter_SupabaseUid(String supabaseUid);
    Page<RoomDetail> findByVerificationStatus(VerificationStatus verificationStatus, Pageable pageable);
}
