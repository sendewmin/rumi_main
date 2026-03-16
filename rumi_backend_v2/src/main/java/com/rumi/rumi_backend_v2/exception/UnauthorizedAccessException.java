package com.rumi.rumi_backend_v2.exception;

public class UnauthorizedAccessException extends RuntimeException {
    public UnauthorizedAccessException() {
        super("Unauthorized access");
    }
}
