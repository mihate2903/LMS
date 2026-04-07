package com.lms.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
public class CourseRequest {
    private Long categoryId;
    
    @NotBlank(message = "Tên khóa học không được để trống")
    private String title;
    
    @NotNull
    @DecimalMin(value = "0.0", message = "Giá khóa học phải lớn hơn hoặc bằng 0")
    private BigDecimal price;
    
    private String description;
    private String thumbnailUrl;
}
