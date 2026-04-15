package com.lms.backend.service;

import com.lms.backend.dto.EnrollmentAdminResponse;
import com.lms.backend.dto.EnrollmentRequest;
import com.lms.backend.dto.EnrollmentResponse;
import com.lms.backend.dto.EnrollmentStatusUpdateRequest;
import com.lms.backend.entity.Course;
import com.lms.backend.entity.Enrollment;
import com.lms.backend.entity.User;
import com.lms.backend.repository.CourseRepository;
import com.lms.backend.repository.EnrollmentRepository;
import com.lms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Override
    public EnrollmentResponse enrollCourse(EnrollmentRequest request, Long userId) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        if (enrollmentRepository.findByUserIdAndCourseId(userId, request.getCourseId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bạn đã đăng ký khóa học này rồi");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .course(course)
                .status("pending")
                .createdAt(LocalDateTime.now())
                .contactName(user.getName())
                .contactPhone(user.getPhone())
                .contactEmail(user.getEmail())
                .build();

        return mapToResponse(enrollmentRepository.save(enrollment));
    }

    @Override
    public List<EnrollmentResponse> getMyEnrollments(Long userId) {
        return enrollmentRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EnrollmentAdminResponse> getAllEnrollmentsForAdmin(String status) {
        Sort sortByDate = Sort.by(Sort.Direction.DESC, "createdAt");
        List<Enrollment> enrollments;
        
        if (status != null && !status.trim().isEmpty()) {
            enrollments = enrollmentRepository.findByStatus(status, sortByDate);
        } else {
            enrollments = enrollmentRepository.findAll(sortByDate);
        }
        
        return enrollments.stream().map(this::mapToAdminResponse).collect(Collectors.toList());
    }

    @Override
    public void updateEnrollmentStatus(Long id, EnrollmentStatusUpdateRequest request) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn ghi danh"));
        
        enrollment.setStatus(request.getStatus());
        enrollmentRepository.save(enrollment);
    }

    private EnrollmentResponse mapToResponse(Enrollment enrollment) {
        EnrollmentResponse.CourseSummary courseSummary = null;
        if (enrollment.getCourse() != null) {
            courseSummary = EnrollmentResponse.CourseSummary.builder()
                    .id(enrollment.getCourse().getId())
                    .title(enrollment.getCourse().getTitle())
                    .thumbnailUrl(enrollment.getCourse().getThumbnailUrl())
                    .build();
        }

        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .status(enrollment.getStatus())
                .createdAt(enrollment.getCreatedAt())
                .contactName(enrollment.getContactName())
                .contactPhone(enrollment.getContactPhone())
                .contactEmail(enrollment.getContactEmail())
                .course(courseSummary)
                .build();
    }

    private EnrollmentAdminResponse mapToAdminResponse(Enrollment enrollment) {
        EnrollmentAdminResponse.CourseAdminDto courseDto = null;
        if (enrollment.getCourse() != null) {
            courseDto = EnrollmentAdminResponse.CourseAdminDto.builder()
                    .courseId(enrollment.getCourse().getId())
                    .title(enrollment.getCourse().getTitle())
                    .price(enrollment.getCourse().getPrice())
                    .build();
        }

        return EnrollmentAdminResponse.builder()
                .enrollmentId(enrollment.getId())
                .status(enrollment.getStatus())
                .createdAt(enrollment.getCreatedAt())
                .contactName(enrollment.getContactName())
                .contactPhone(enrollment.getContactPhone())
                .contactEmail(enrollment.getContactEmail())
                .course(courseDto)
                .build();
    }
}
