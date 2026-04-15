package com.lms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class EnrollmentStatusUpdateRequest {
    @NotBlank(message = "Trạng thái không được để trống")
    @Pattern(regexp = "^(approved|rejected)$", message = "Trạng thái chỉ được phép là 'approved' hoặc 'rejected'")
    private String status;
}
