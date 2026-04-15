package com.lms.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
public class LessonRequest {
    @NotNull(message = "Course ID không được để trống")
    private Long courseId;
    
    @NotBlank(message = "Tiêu đề bài học không được để trống")
    @Size(max = 255, message = "Tiêu đề không quá 255 ký tự")
    private String title;
    
    private String videoUrl;
    private String content;
    
    @NotNull(message = "Thứ tự bài học không được để trống")
    private Integer lessonOrder;
}
