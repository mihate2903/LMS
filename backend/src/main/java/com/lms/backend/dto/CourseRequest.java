package com.lms.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

@Data
public class CourseRequest {
    @NotNull(message = "Danh mục khóa học không được để trống")
    private Long categoryId;
    
    @NotBlank(message = "Tên khóa học không được để trống")
    @Size(max = 255, message = "Tên khóa học không được vượt quá 255 ký tự")
    private String title;
    
    @NotNull(message = "Giá khóa học không được để trống")
    @DecimalMin(value = "0.0", message = "Giá khóa học phải lớn hơn hoặc bằng 0")
    private BigDecimal price;
    
    @NotBlank(message = "Mô tả khóa học không được để trống")
    private String description;
    
    @NotBlank(message = "URL ảnh đại diện không được để trống")
    private String thumbnailUrl;
}
