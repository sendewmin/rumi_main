package com.rumi.rumi_backend_v2.dto;

import java.util.List;

public class RoomDetailResponse {
    private Long roomId;
    private String roomTitle;
    private String roomDescription;
    private String genderAllowed;
    private int maxRoommates;
    private String roomStatus;
    private AddressDTO address;
    private PriceDTO price;
    private List<AmenityDTO> amenities;
    private List<RuleDTO> rules;
    private List<PaymentConditionDTO> paymentConditions;
    private Long renterId;
    private List<String> imageUrls;
    // getters and setters
    // ...

    public static class AddressDTO {
        private Integer houseNumber;
        private String addressLine;
        private String city;
        private String country;
        private String mapUrl;
        // getters and setters
        // ...
    }

    public static class PriceDTO {
        private Long amount;
        private Long advance;
        private String billingCycle;
        // getters and setters
        // ...
    }

    public static class AmenityDTO {
        private Long amenityId;
        private String name;
        // getters and setters
        // ...
    }

    public static class RuleDTO {
        private Long ruleId;
        private String name;
        // getters and setters
        // ...
    }

    public static class PaymentConditionDTO {
        private Long conditionId;
        private String name;
        // getters and setters
        // ...
    }
}
