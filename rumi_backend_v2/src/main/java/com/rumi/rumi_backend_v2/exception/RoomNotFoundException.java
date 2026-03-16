package com.rumi.rumi_backend_v2.exception;

public class RoomNotFoundException extends RuntimeException {
    public RoomNotFoundException(Long id) {
        super("Room not found with id: " + id);
    }
}
