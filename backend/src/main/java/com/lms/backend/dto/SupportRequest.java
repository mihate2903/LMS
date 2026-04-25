package com.lms.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class SupportRequest {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    @NotBlank(message = "Nội dung không được để trống")
    private String description;
}
