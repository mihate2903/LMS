package com.lms.backend.service;

import com.lms.backend.dto.LessonProgressResponse;
import com.lms.backend.dto.QuizResultResponse;

import java.util.List;
import java.util.Map;

public interface StudyService {
    QuizResultResponse submitQuiz(Long lessonId, Map<Long, String> answers);
    LessonProgressResponse markComplete(Long lessonId);
    List<LessonProgressResponse> getCourseProgress(Long courseId);
}
