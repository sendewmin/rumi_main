package com.rumi.rumi_backend_v2.dto;

import com.rumi.rumi_backend_v2.enums.GenderAllowed;
import com.rumi.rumi_backend_v2.enums.RoomStatus;
import com.rumi.rumi_backend_v2.enums.RoomType;
import com.rumi.rumi_backend_v2.enums.BillingCycle;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomCreateRequest {
    @NotBlank(message = "Room title is required")
    private String roomTitle;
    @NotBlank(message = "Room description is required")
    private String roomDescription;
    private GenderAllowed genderAllowed;
    private int maxRoommates;
    @Builder.Default
    private RoomStatus roomStatus = RoomStatus.AVAILABLE;
    private RoomType roomType;
    private AddressDto address;
    private PriceDto price;
    private List<Long> amenityIds;
    private List<Long> ruleIds;
    private List<Long> paymentConditionIds;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressDto {
        private Integer houseNumber;
        private String addressLine;
        private String city;
        private String country;
        private String mapUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PriceDto {
        private Integer amount;
        private Integer advance;
        private BillingCycle billingCycle;
    }
}
