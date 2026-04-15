package com.lms.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CourseResponse {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String title;
    private BigDecimal price;
    private String description;
    private String thumbnailUrl;
    private LocalDateTime deletedAt;
    private List<LessonResponse> lessons;
}
