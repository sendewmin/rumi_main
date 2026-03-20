package com.rumi.rumi_backend_v2.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public class RoomCreateRequest {
    @NotBlank
    private String roomTitle;
    @NotBlank
    private String roomDescription;
    @NotBlank
    private String genderAllowed;
    @Min(1)
    private int maxRoommates;
    private String roomStatus = "AVAILABLE";
    @Valid
    @NotNull
    private AddressDTO address;
    @Valid
    @NotNull
    private PriceDTO price;
    @NotNull
    private List<Long> amenityIds;
    @NotNull
    private List<Long> ruleIds;
    @NotNull
    private List<Long> paymentConditionIds;

    // getters and setters
    // ...

    public static class AddressDTO {
        @NotNull
        private Integer houseNumber;
        @NotBlank
        private String addressLine;
        @NotBlank
        private String city;
        @NotBlank
        private String country;
        private String mapUrl;
        // getters and setters
        // ...
    }

    public static class PriceDTO {
        @NotNull
        private Long amount;
        @NotNull
        private Long advance;
        @NotBlank
        private String billingCycle;
        // getters and setters
        // ...
    }
}
