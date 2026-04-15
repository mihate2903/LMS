package com.lms.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class EnrollmentResponse {
    private Long id;
    private String status;
    private LocalDateTime createdAt;
    private String contactName;
    private String contactPhone;
    private String contactEmail;
    private CourseSummary course;

    @Data
    @Builder
    public static class CourseSummary {
        private Long id;
        private String title;
        private String thumbnailUrl;
    }
}
