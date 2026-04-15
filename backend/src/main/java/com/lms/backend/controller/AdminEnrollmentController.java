package com.lms.backend.controller;

import com.lms.backend.dto.EnrollmentAdminResponse;
import com.lms.backend.dto.EnrollmentStatusUpdateRequest;
import com.lms.backend.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/enrollments")
@RequiredArgsConstructor
public class AdminEnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_admin')")
    public ResponseEntity<List<EnrollmentAdminResponse>> getAllEnrollments(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(enrollmentService.getAllEnrollmentsForAdmin(status));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_admin')")
    public ResponseEntity<String> updateEnrollmentStatus(@PathVariable Long id, @Valid @RequestBody EnrollmentStatusUpdateRequest request) {
        enrollmentService.updateEnrollmentStatus(id, request);
        return ResponseEntity.ok("Cập nhật trạng thái ghi danh thành công!");
    }
}
