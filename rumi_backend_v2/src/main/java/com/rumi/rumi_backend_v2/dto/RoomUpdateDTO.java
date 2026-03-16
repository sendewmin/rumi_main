package com.rumi.rumi_backend_v2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomUpdateDTO {
    private String title;
    private String description;
    private Double rent;
    private String location;
}
