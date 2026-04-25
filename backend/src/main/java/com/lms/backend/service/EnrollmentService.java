package com.lms.backend.service;

import com.lms.backend.dto.EnrollmentRequest;
import com.lms.backend.dto.EnrollmentResponse;

import com.lms.backend.dto.EnrollmentAdminResponse;
import com.lms.backend.dto.EnrollmentStatusUpdateRequest;

import java.util.List;

public interface EnrollmentService {
    EnrollmentResponse enrollCourse(EnrollmentRequest request, Long userId);
    List<EnrollmentResponse> getMyEnrollments(Long userId);
    
    List<EnrollmentAdminResponse> getAllEnrollmentsForAdmin(String status, Long courseId, Long userId);
    void updateEnrollmentStatus(Long id, EnrollmentStatusUpdateRequest request);
}
