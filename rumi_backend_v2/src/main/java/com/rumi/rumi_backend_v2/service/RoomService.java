package com.rumi.rumi_backend_v2.service;

import com.rumi.rumi_backend_v2.dto.RoomCreateRequest;
import com.rumi.rumi_backend_v2.dto.RoomDetailResponse;
import com.rumi.rumi_backend_v2.dto.RoomUpdateRequest;

public interface RoomService {
    Long createRoom(RoomCreateRequest dto, String authHeader);
    RoomDetailResponse getRoom(Long roomId);
    // Optional methods
    // List<RoomDetailResponse> getRoomsByRenter(String authHeader);
    // void updateRoom(Long roomId, RoomUpdateRequest dto, String authHeader);
}
