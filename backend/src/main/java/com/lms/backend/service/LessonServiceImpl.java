package com.lms.backend.service;

import com.lms.backend.dto.LessonRequest;
import com.lms.backend.dto.LessonResponse;
import com.lms.backend.entity.Course;
import com.lms.backend.entity.Enrollment;
import com.lms.backend.entity.Lesson;
import com.lms.backend.repository.CourseRepository;
import com.lms.backend.repository.EnrollmentRepository;
import com.lms.backend.repository.LessonRepository;
import com.lms.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    public List<LessonResponse> getAllLessons() {
        return lessonRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public LessonResponse getLessonById(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));

        // --- Lính Gác Bảo Mật: Kiểm tra quyền truy cập Video ---
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            // Chưa đăng nhập -> Chặn!
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn cần đăng nhập để xem bài học này!");
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getId();
        Long courseId = lesson.getCourse().getId();

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equalsIgnoreCase("ROLE_admin"));

        if (!isAdmin) {
            // Kiểm tra Enrollment: Phải mua VÀ được Admin duyệt mới cho xem!
            Optional<Enrollment> enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
            if (enrollment.isEmpty() || !"approved".equalsIgnoreCase(enrollment.get().getStatus())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Khóa học chưa được phê duyệt hoặc bạn chưa đăng ký. Vui lòng kiểm tra lại!");
            }
        }

        return mapToResponse(lesson);
    }

    @Override
    public LessonResponse createLesson(LessonRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        Lesson lesson = Lesson.builder()
                .course(course)
                .title(request.getTitle())
                .videoUrl(request.getVideoUrl())
                .content(request.getContent())
                .lessonOrder(request.getLessonOrder())
                .build();

        return mapToResponse(lessonRepository.save(lesson));
    }

    @Override
    public LessonResponse updateLesson(Long id, LessonRequest request) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        lesson.setCourse(course);
        lesson.setTitle(request.getTitle());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setContent(request.getContent());
        lesson.setLessonOrder(request.getLessonOrder());

        return mapToResponse(lessonRepository.save(lesson));
    }

    @Override
    public void deleteLesson(Long id) {
        if (!lessonRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found");
        }
        lessonRepository.deleteById(id);
    }

    private LessonResponse mapToResponse(Lesson lesson) {
        return LessonResponse.builder()
                .id(lesson.getId())
                .courseId(lesson.getCourse() != null ? lesson.getCourse().getId() : null)
                .title(lesson.getTitle())
                .videoUrl(lesson.getVideoUrl())
                .content(lesson.getContent())
                .lessonOrder(lesson.getLessonOrder())
                .deletedAt(lesson.getDeletedAt())
                .build();
    }
}
