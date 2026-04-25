package com.lms.backend.service;

import com.lms.backend.dto.ReviewDTO;
import java.util.List;

public interface ReviewService {
    List<ReviewDTO> getReviewsByCourse(Long courseId);
    ReviewDTO addReview(Long courseId, Integer rating, String content);
}
