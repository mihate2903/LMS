package com.lms.backend.controller;

import com.lms.backend.dto.LessonProgressResponse;
import com.lms.backend.dto.QuestionResponse;
import com.lms.backend.dto.QuizResultResponse;
import com.lms.backend.service.QuestionService;
import com.lms.backend.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/study")
@RequiredArgsConstructor
public class StudyController {

    private final StudyService studyService;
    private final QuestionService questionService;

    @GetMapping("/courses/{courseId}/progress")
    public ResponseEntity<List<LessonProgressResponse>> getCourseProgress(@PathVariable Long courseId) {
        return ResponseEntity.ok(studyService.getCourseProgress(courseId));
    }

    @GetMapping("/lessons/{lessonId}/questions")
    public ResponseEntity<List<QuestionResponse>> getLessonQuestions(@PathVariable Long lessonId) {
        // false để bảo vệ thuộc tính `correctAnswer` khỏi sinh viên
        return ResponseEntity.ok(questionService.getQuestionsByLessonId(lessonId, false));
    }

    @PostMapping("/lessons/{lessonId}/submit-quiz")
    public ResponseEntity<QuizResultResponse> submitQuiz(@PathVariable Long lessonId, @RequestBody Map<Long, String> answers) {
        return ResponseEntity.ok(studyService.submitQuiz(lessonId, answers));
    }

    @PostMapping("/lessons/{lessonId}/complete")
    public ResponseEntity<LessonProgressResponse> completeLesson(@PathVariable Long lessonId) {
        return ResponseEntity.ok(studyService.markComplete(lessonId));
    }
}
