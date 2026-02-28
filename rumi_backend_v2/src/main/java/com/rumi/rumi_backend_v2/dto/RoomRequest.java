package com.rumi.dto;

// DTO = Data Transfer Object
// This is what the frontend sends when creating or updating a room.
// We use a DTO so we never expose internal entity fields directly.

public class RoomRequest {

    private String title;
    private String description;
    private Double rent;
    private String location;

    // Getters & Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getRent() { return rent; }
    public void setRent(Double rent) { this.rent = rent; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}