package com.lms.backend.service;

import com.lms.backend.dto.LessonRequest;
import com.lms.backend.dto.LessonResponse;

import java.util.List;

public interface LessonService {
    List<LessonResponse> getAllLessons();
    LessonResponse getLessonById(Long id);
    LessonResponse createLesson(LessonRequest request);
    LessonResponse updateLesson(Long id, LessonRequest request);
    void deleteLesson(Long id);
}
