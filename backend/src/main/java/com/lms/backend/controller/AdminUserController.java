package com.lms.backend.controller;

import com.lms.backend.dto.ProfileResponse;
import com.lms.backend.dto.UserRoleUpdateRequest;
import com.lms.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_admin') or hasAuthority('ROLE_ADMIN') or hasAuthority('admin') or hasAuthority('ADMIN')")
    public ResponseEntity<List<ProfileResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasAuthority('ROLE_admin') or hasAuthority('ROLE_ADMIN') or hasAuthority('admin') or hasAuthority('ADMIN')")
    public ResponseEntity<String> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UserRoleUpdateRequest request) {
        userService.updateUserRole(id, request.getRole());
        return ResponseEntity.ok("Cập nhật quyền hạn thành công!");
    }
}
