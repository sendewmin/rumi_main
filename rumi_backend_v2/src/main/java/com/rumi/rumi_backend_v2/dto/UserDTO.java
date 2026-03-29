package com.rumi.rumi_backend_v2.dto;

import com.rumi.rumi_backend_v2.enums.RoleName;
import com.rumi.rumi_backend_v2.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private String userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private RoleName role;
    private UserStatus status;
    private boolean profileComplete;
    private boolean phoneVerified;
    private LocalDateTime createdDate;
}
