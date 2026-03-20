package com.rumi.rumi_backend_v2.dto;

import com.rumi.rumi_backend_v2.enums.GenderAllowed;
import com.rumi.rumi_backend_v2.enums.RoomStatus;
import com.rumi.rumi_backend_v2.enums.BillingCycle;
import jakarta.validation.Valid;
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
public class RoomUpdateRequest {
    @NotBlank
    private String roomTitle;
    @NotBlank
    private String roomDescription;
    @NotNull
    private GenderAllowed genderAllowed;
    @Min(1)
    private int maxRoommates;
    private RoomStatus roomStatus;
    @Valid
    @NotNull
    private RoomCreateRequest.AddressDto address;
    @Valid
    @NotNull
    private RoomCreateRequest.PriceDto price;
    @NotNull
    private List<@NotNull Long> amenityIds;
    @NotNull
    private List<@NotNull Long> ruleIds;
    @NotNull
    private List<@NotNull Long> paymentConditionIds;
}
