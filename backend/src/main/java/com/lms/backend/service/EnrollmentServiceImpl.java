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
    private final NotificationService notificationService;

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

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        // Notify user about pending enrollment
        notificationService.createNotification(
            user,
            "ENROLLMENT_PENDING",
            "Đơn đăng ký khóa học '" + course.getTitle() + "' của bạn đang chờ phê duyệt.",
            "/profile"
        );

        // Notify all Admins about new enrollment request
        List<User> admins = userRepository.findAllByRole("ADMIN");
        admins.addAll(userRepository.findAllByRole("ROLE_ADMIN"));
        for (User admin : admins) {
            notificationService.createNotification(
                admin,
                "ADMIN_NEW_ENROLLMENT",
                "Có yêu cầu đăng ký mới cho khóa học '" + course.getTitle() + "' từ " + user.getName(),
                "/admin"
            );
        }

        return mapToResponse(savedEnrollment);
    }

    @Override
    public List<EnrollmentResponse> getMyEnrollments(Long userId) {
        return enrollmentRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EnrollmentAdminResponse> getAllEnrollmentsForAdmin(String status, Long courseId, Long userId) {
        Sort sortByDate = Sort.by(Sort.Direction.DESC, "createdAt");
        List<Enrollment> enrollments;
        
        boolean hasStatus = status != null && !status.trim().isEmpty();
        boolean hasCourseId = courseId != null;
        boolean hasUserId = userId != null;

        // Since this is a simple query builder without Specification, 
        // we handle the common combinations or fall back to code-level filtering.
        // For simplicity, we prioritize filters.
        if (hasUserId) {
            if (hasStatus) enrollments = enrollmentRepository.findByStatusAndUserId(status, userId, sortByDate);
            else enrollments = enrollmentRepository.findByUserId(userId, sortByDate);
        } else if (hasCourseId) {
            if (hasStatus) enrollments = enrollmentRepository.findByStatusAndCourseId(status, courseId, sortByDate);
            else enrollments = enrollmentRepository.findByCourseId(courseId, sortByDate);
        } else if (hasStatus) {
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

        // Notify user about status change
        String statusMsg = request.getStatus().equalsIgnoreCase("approved") ? "đã được duyệt" : "đã bị từ chối";
        String type = request.getStatus().equalsIgnoreCase("approved") ? "ENROLLMENT_APPROVED" : "ENROLLMENT_REJECTED";
        
        notificationService.createNotification(
            enrollment.getUser(),
            type,
            "Đơn đăng ký khóa học '" + enrollment.getCourse().getTitle() + "' của bạn " + statusMsg + ".",
            request.getStatus().equalsIgnoreCase("approved") ? "/study/" + enrollment.getCourse().getId() : "/profile"
        );
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
                .contactName(enrollment.getUser() != null ? enrollment.getUser().getName() : enrollment.getContactName())
                .contactPhone(enrollment.getUser() != null ? enrollment.getUser().getPhone() : enrollment.getContactPhone())
                .contactEmail(enrollment.getUser() != null ? enrollment.getUser().getEmail() : enrollment.getContactEmail())
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
                .contactName(enrollment.getUser() != null ? enrollment.getUser().getName() : enrollment.getContactName())
                .contactPhone(enrollment.getUser() != null ? enrollment.getUser().getPhone() : enrollment.getContactPhone())
                .contactEmail(enrollment.getUser() != null ? enrollment.getUser().getEmail() : enrollment.getContactEmail())
                .course(courseDto)
                .build();
    }
}
