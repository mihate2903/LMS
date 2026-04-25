package com.lms.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class UserRoleUpdateRequest {
    @NotBlank(message = "Tên vai trò không được để trống")
    private String role;
}
