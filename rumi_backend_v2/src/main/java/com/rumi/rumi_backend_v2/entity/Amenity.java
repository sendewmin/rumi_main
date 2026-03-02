package com.rumi.rumi_backend_v2.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="amenity")
@NoArgsConstructor   // Here a default constructor will be created for the RoomDetail class.
@AllArgsConstructor  // Here a parameterised constructor will be created for the RoomDetail class.
public class Amenity {

    @Id
    @Getter
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="amenity_id")
    private Long amenityId;

    @Getter
    @Setter
    @Column(name="amenity_name")
    private String amenityName;

}
