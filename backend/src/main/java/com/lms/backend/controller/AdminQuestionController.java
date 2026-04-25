package com.lms.backend.controller;

import com.lms.backend.dto.QuestionRequest;
import com.lms.backend.dto.QuestionResponse;
import com.lms.backend.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/lessons")
@RequiredArgsConstructor
public class AdminQuestionController {

    private final QuestionService questionService;

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_admin')")
    @GetMapping("/{lessonId}/questions")
    public ResponseEntity<List<QuestionResponse>> getQuestionsForAdmin(@PathVariable Long lessonId) {
        return ResponseEntity.ok(questionService.getQuestionsByLessonId(lessonId, true));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_admin')")
    @PostMapping("/{lessonId}/questions")
    public ResponseEntity<QuestionResponse> addQuestion(@PathVariable Long lessonId, @Valid @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(questionService.addQuestion(lessonId, request));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_admin')")
    @PutMapping("/questions/{id}")
    public ResponseEntity<QuestionResponse> updateQuestion(@PathVariable Long id, @Valid @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(questionService.updateQuestion(id, request));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_admin')")
    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
