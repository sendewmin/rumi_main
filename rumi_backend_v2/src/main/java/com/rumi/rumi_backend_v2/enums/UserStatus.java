package com.rumi.rumi_backend_v2.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum UserStatus {
    ACTIVE,
    INACTIVE,
    SUSPENDED,
    DELETED;

    @JsonCreator
    public static UserStatus fromValue(String value) {
        if (value == null) {
            return null;
        }
        return UserStatus.valueOf(value.trim().toUpperCase());
    }
}
