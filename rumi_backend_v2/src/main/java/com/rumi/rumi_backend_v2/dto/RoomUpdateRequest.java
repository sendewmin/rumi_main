package com.rumi.rumi_backend_v2.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public class RoomUpdateRequest {
    @NotBlank
    private String roomTitle;
    @NotBlank
    private String roomDescription;
    @NotBlank
    private String genderAllowed;
    @Min(1)
    private int maxRoommates;
    private String roomStatus;
    @Valid
    @NotNull
    private RoomCreateRequest.AddressDTO address;
    @Valid
    @NotNull
    private RoomCreateRequest.PriceDTO price;
    @NotNull
    private List<Long> amenityIds;
    @NotNull
    private List<Long> ruleIds;
    @NotNull
    private List<Long> paymentConditionIds;
    // getters and setters
    // ...
}
