package com.lms.backend.controller;

import com.lms.backend.dto.ReviewDTO;
import com.lms.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ReviewDTO>> getCourseReviews(@PathVariable Long courseId) {
        return ResponseEntity.ok(reviewService.getReviewsByCourse(courseId));
    }

    @PostMapping("/course/{courseId}")
    public ResponseEntity<?> addReview(@PathVariable Long courseId, @RequestBody Map<String, Object> body) {
        try {
            Integer rating = (Integer) body.get("rating");
            String content = (String) body.get("content");
            return ResponseEntity.ok(reviewService.addReview(courseId, rating, content));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
