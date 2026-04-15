package com.lms.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LessonResponse {
    private Long id;
    private Long courseId;
    private String title;
    private String videoUrl;
    private String content;
    private Integer lessonOrder;
    private LocalDateTime deletedAt;
}
