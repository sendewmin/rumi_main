package com.rumi.rumi_backend_v2.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum RoleName {
    ADMIN,
    RENTER,
    RENTEE;

    @JsonCreator
    public static RoleName fromValue(String value) {
        if (value == null) {
            return null;
        }
        return RoleName.valueOf(value.trim().toUpperCase());
    }
}
