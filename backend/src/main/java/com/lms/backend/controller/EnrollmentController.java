package com.lms.backend.controller;

import com.lms.backend.dto.EnrollmentRequest;
import com.lms.backend.dto.EnrollmentResponse;
import com.lms.backend.security.CustomUserDetails;
import com.lms.backend.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<EnrollmentResponse> enrollCourse(@Valid @RequestBody EnrollmentRequest request) {
        Long userId = extractUserId();
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollmentService.enrollCourse(request, userId));
    }

    @GetMapping("/my-courses")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<EnrollmentResponse>> getMyEnrollments() {
        Long userId = extractUserId();
        return ResponseEntity.ok(enrollmentService.getMyEnrollments(userId));
    }

    private Long extractUserId() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }
}
