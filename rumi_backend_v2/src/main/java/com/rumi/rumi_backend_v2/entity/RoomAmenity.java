package com.rumi.rumi_backend_v2.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Table (name="room_amenity")
@AllArgsConstructor
@NoArgsConstructor
public class RoomAmenity {

    @ManyToOne
    @JoinColumn(name="amenity_id", nullable=false)
    @Getter
    private Amenity amenity;

    @ManyToOne
    @JoinColumn(name="room_id",nullable=false)
    @Getter
    private RoomDetail room;  // here we pass the RoomDetail object where the hibrenate takes only the id of the room

}
