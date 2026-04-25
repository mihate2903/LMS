package com.lms.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LessonProgressResponse {
    private Long lessonId;
    private boolean completed;
    private Integer score;
}
