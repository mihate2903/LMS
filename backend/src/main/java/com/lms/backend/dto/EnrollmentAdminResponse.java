package com.lms.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class EnrollmentAdminResponse {
    private Long enrollmentId;
    private String status;
    private LocalDateTime createdAt;
    private String contactName;
    private String contactPhone;
    private String contactEmail;
    private CourseAdminDto course;

    @Data
    @Builder
    public static class CourseAdminDto {
        private Long courseId;
        private String title;
        private BigDecimal price;
    }
}
