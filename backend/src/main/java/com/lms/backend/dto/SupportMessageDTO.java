package com.lms.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SupportMessageDTO {
    private Long id;
    private String title;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private UserInfo user;

    @Data
    @Builder
    public static class UserInfo {
        private String name;
        private String email;
        private String phone;
    }
}
