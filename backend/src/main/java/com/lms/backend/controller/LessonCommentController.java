package com.lms.backend.controller;

import com.lms.backend.dto.CommentDTO;
import com.lms.backend.service.LessonCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lesson-comments")
@RequiredArgsConstructor
public class LessonCommentController {
    private final LessonCommentService commentService;

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<CommentDTO>> getLessonComments(@PathVariable Long lessonId) {
        return ResponseEntity.ok(commentService.getCommentsByLesson(lessonId));
    }

    @PostMapping("/lesson/{lessonId}")
    public ResponseEntity<?> addComment(@PathVariable Long lessonId, @RequestBody Map<String, Object> body) {
        try {
            String content = (String) body.get("content");
            Long parentId = body.get("parentId") != null ? Long.valueOf(body.get("parentId").toString()) : null;
            return ResponseEntity.ok(commentService.addComment(lessonId, content, parentId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
