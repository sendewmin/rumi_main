package com.rumi.rumi_backend_v2.service.impl;

import com.rumi.rumi_backend_v2.dto.RoomDetailResponse;
import com.rumi.rumi_backend_v2.entity.Address;
import com.rumi.rumi_backend_v2.entity.RoomDetail;
import com.rumi.rumi_backend_v2.entity.RoomPrice;
import com.rumi.rumi_backend_v2.entity.User;
import com.rumi.rumi_backend_v2.enums.ApprovalStatus;
import com.rumi.rumi_backend_v2.enums.RoleName;
import com.rumi.rumi_backend_v2.repo.RoomRepo;
import com.rumi.rumi_backend_v2.repo.UserRepo;
import com.rumi.rumi_backend_v2.service.AdminService;
import com.rumi.rumi_backend_v2.util.SupabaseAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final RoomRepo roomRepo;
    private final UserRepo userRepo;
    private final SupabaseAuthService supabaseAuthService;

    /**
     * Check if user has admin role
     */
    private void verifyAdmin(String authHeader) {
        try {
            String userId = supabaseAuthService.getUserId(authHeader);
            User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
            
            if (user.getRole() != RoleName.ADMIN) {
                log.warn("Non-admin user {} attempted admin operation", userId);
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can perform this action");
            }
            log.info("Admin {} verified for operation", userId);
        } catch (Exception e) {
            if (e instanceof ResponseStatusException) throw e;
            log.error("Admin verification failed: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authorization token");
        }
    }

    /**
     * Convert RoomDetail entity to RoomDetailResponse DTO
     */
    private RoomDetailResponse buildRoomDetailResponse(RoomDetail room) {
        Address address = room.getAddress();
        RoomPrice price = room.getRoomPrice();
        
        return RoomDetailResponse.builder()
                .roomId(room.getRoomId())
                .roomTitle(room.getRoomTitle())
                .roomDescription(room.getRoomDescription())
                .genderAllowed(room.getGenderAllowed())
                .maxRoommates(room.getMaxRoommates())
                .roomStatus(room.getRoomStatus())
                .roomType(room.getRoomType())
                .approvalStatus(room.getApprovalStatus())
                .rejectionReason(room.getRejectionReason())
                .address(address == null ? null : RoomDetailResponse.AddressDto.builder()
                        .houseNumber(address.getHouseNumber())
                        .addressLine(address.getAddressLine())
                        .city(address.getCity())
                        .country(address.getCountry())
                        .mapUrl(address.getMapUrl())
                        .build())
                .price(price == null ? null : RoomDetailResponse.PriceDto.builder()
                        .amount(price.getAmount())
                        .advance(price.getAdvance())
                        .billingCycle(price.getBillingCycle())
                        .build())
                .amenities(room.getAmenities() == null ? null : room.getAmenities().stream()
                        .map(a -> RoomDetailResponse.AmenityDto.builder()
                                .amenityId(a.getAmenityId())
                                .name(a.getAmenityName())
                                .build())
                        .collect(Collectors.toList()))
                .rules(room.getRules() == null ? null : room.getRules().stream()
                        .map(r -> RoomDetailResponse.RuleDto.builder()
                                .ruleId(r.getRuleId())
                                .name(r.getRuleName())
                                .build())
                        .collect(Collectors.toList()))
                .paymentConditions(room.getPaymentConditions() == null ? null : room.getPaymentConditions().stream()
                        .map(pc -> RoomDetailResponse.PaymentConditionDto.builder()
                                .conditionId(pc.getConditionId())
                                .name(pc.getConditionName().name())
                                .build())
                        .collect(Collectors.toList()))
                .renterId(room.getRenter() != null ? room.getRenter().getUserId() : null)
                .build();
    }

    @Override
    public Page<RoomDetailResponse> getPendingListings(int page, int size, String authHeader) {
        verifyAdmin(authHeader);
        
        Pageable pageable = PageRequest.of(page, size);
        
        try {
            // Fetch all rooms and filter by approval status
            List<RoomDetail> allRooms = roomRepo.findAll();
            List<RoomDetail> pendingRooms = allRooms.stream()
                    .filter(room -> room.getApprovalStatus() == ApprovalStatus.PENDING)
                    .collect(Collectors.toList());
            
            // Manually handle pagination
            int start = (int) pageable.getOffset();
            int end = Math.min(start + pageable.getPageSize(), pendingRooms.size());
            List<RoomDetailResponse> pageContent = pendingRooms.subList(start, end).stream()
                    .map(this::buildRoomDetailResponse)
                    .collect(Collectors.toList());
            
            log.info("Retrieved {} pending listings for page {}", pageContent.size(), page);
            return new PageImpl<>(pageContent, pageable, pendingRooms.size());
        } catch (Exception e) {
            log.error("Error fetching pending listings: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch pending listings");
        }
    }

    @Override
    @Transactional
    public void approveListing(Long roomId, String authHeader) {
        verifyAdmin(authHeader);
        
        try {
            RoomDetail room = roomRepo.findByRoomId(roomId);
            if (room == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found");
            }
            
            if (room.getApprovalStatus() != ApprovalStatus.PENDING) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "Only pending listings can be approved. Current status: " + room.getApprovalStatus());
            }
            
            room.setApprovalStatus(ApprovalStatus.APPROVED);
            room.setRejectionReason(null);
            roomRepo.save(room);
            
            log.info("Room {} approved by admin", roomId);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error approving listing {}: {}", roomId, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to approve listing");
        }
    }

    @Override
    @Transactional
    public void rejectListing(Long roomId, String reason, String authHeader) {
        verifyAdmin(authHeader);
        
        try {
            RoomDetail room = roomRepo.findByRoomId(roomId);
            if (room == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found");
            }
            
            if (room.getApprovalStatus() != ApprovalStatus.PENDING) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "Only pending listings can be rejected. Current status: " + room.getApprovalStatus());
            }
            
            room.setApprovalStatus(ApprovalStatus.REJECTED);
            room.setRejectionReason(reason != null ? reason : "Rejected by admin");
            roomRepo.save(room);
            
            log.info("Room {} rejected by admin with reason: {}", roomId, reason);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error rejecting listing {}: {}", roomId, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to reject listing");
        }
    }

    @Override
    public Page<RoomDetailResponse> getListingsWithStatus(int page, int size, String status, String authHeader) {
        verifyAdmin(authHeader);
        
        Pageable pageable = PageRequest.of(page, size);
        
        try {
            List<RoomDetail> allRooms = roomRepo.findAll();
            List<RoomDetail> filteredRooms = allRooms;
            
            // Filter by status if provided
            if (status != null && !status.isEmpty()) {
                try {
                    ApprovalStatus approvalStatus = ApprovalStatus.valueOf(status.toUpperCase());
                    filteredRooms = allRooms.stream()
                            .filter(room -> room.getApprovalStatus() == approvalStatus)
                            .collect(Collectors.toList());
                } catch (IllegalArgumentException e) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                        "Invalid approval status: " + status);
                }
            }
            
            // Manually handle pagination
            int start = (int) pageable.getOffset();
            int end = Math.min(start + pageable.getPageSize(), filteredRooms.size());
            List<RoomDetailResponse> pageContent = filteredRooms.subList(start, end).stream()
                    .map(this::buildRoomDetailResponse)
                    .collect(Collectors.toList());
            
            log.info("Retrieved {} listings with status filter for page {}", pageContent.size(), page);
            return new PageImpl<>(pageContent, pageable, filteredRooms.size());
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error fetching listings with status: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch listings");
        }
    }

    @Override
    public Map<String, Long> getApprovalStatistics(String authHeader) {
        verifyAdmin(authHeader);
        
        try {
            List<RoomDetail> allRooms = roomRepo.findAll();
            Map<String, Long> stats = new HashMap<>();
            
            stats.put("pending", allRooms.stream()
                    .filter(room -> room.getApprovalStatus() == ApprovalStatus.PENDING)
                    .count());
            stats.put("approved", allRooms.stream()
                    .filter(room -> room.getApprovalStatus() == ApprovalStatus.APPROVED)
                    .count());
            stats.put("rejected", allRooms.stream()
                    .filter(room -> room.getApprovalStatus() == ApprovalStatus.REJECTED)
                    .count());
            stats.put("total", (long) allRooms.size());
            
            log.info("Approval statistics: {}", stats);
            return stats;
        } catch (Exception e) {
            log.error("Error fetching approval statistics: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch statistics");
        }
    }
}
