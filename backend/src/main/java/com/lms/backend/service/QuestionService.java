package com.lms.backend.service;

import com.lms.backend.dto.QuestionRequest;
import com.lms.backend.dto.QuestionResponse;

import java.util.List;

public interface QuestionService {
    List<QuestionResponse> getQuestionsByLessonId(Long lessonId, boolean includeCorrectAnswer);
    QuestionResponse addQuestion(Long lessonId, QuestionRequest request);
    QuestionResponse updateQuestion(Long id, QuestionRequest request);
    void deleteQuestion(Long id);
}
