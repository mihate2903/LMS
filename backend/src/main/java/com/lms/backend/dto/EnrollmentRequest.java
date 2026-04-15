package com.lms.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Data
public class EnrollmentRequest {
    @NotNull(message = "ID khóa học không được để trống")
    private Long courseId;
}
