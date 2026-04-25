package com.lms.backend.service;

import com.lms.backend.dto.ReviewDTO;
import com.lms.backend.entity.Course;
import com.lms.backend.entity.Review;
import com.lms.backend.entity.User;
import com.lms.backend.repository.CourseRepository;
import com.lms.backend.repository.EnrollmentRepository;
import com.lms.backend.repository.ReviewRepository;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    public List<ReviewDTO> getReviewsByCourse(Long courseId) {
        return reviewRepository.findByCourseIdOrderByCreatedAtDesc(courseId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReviewDTO addReview(Long courseId, Integer rating, String content) {
        CustomUserDetails principal = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = principal.getId();

        // 1. Check if user enrolled
        boolean isEnrolled = enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
        if (!isEnrolled) {
            throw new RuntimeException("Bạn phải tham gia khóa học mới được đánh giá.");
        }

        // 2. Check if already reviewed
        if (reviewRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new RuntimeException("Bạn đã đánh giá khóa học này rồi.");
        }

        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Review review = Review.builder()
                .course(course)
                .user(user)
                .rating(rating)
                .content(content)
                .build();

        return mapToDTO(reviewRepository.save(review));
    }

    private ReviewDTO mapToDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .userName(review.getUser().getName())
                .userAvatar(review.getUser().getAvatarUrl())
                .rating(review.getRating())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
