package com.rumi.rumi_backend_v2.service;

import com.rumi.rumi_backend_v2.dto.RoomDetailResponse;
import org.springframework.data.domain.Page;
import java.util.Map;

public interface AdminService {
    Page<RoomDetailResponse> getPendingListings(int page, int size, String authHeader);
    void approveListing(Long roomId, String authHeader);
    void rejectListing(Long roomId, String reason, String authHeader);
    Page<RoomDetailResponse> getListingsWithStatus(int page, int size, String status, String authHeader);
    Map<String, Long> getApprovalStatistics(String authHeader);
}
