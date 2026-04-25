package com.lms.backend.controller;

import com.lms.backend.dto.SupportRequest;
import com.lms.backend.entity.SupportMessage;
import com.lms.backend.entity.User;
import com.lms.backend.repository.SupportMessageRepository;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.service.NotificationService;
import com.lms.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final SupportMessageRepository supportMessageRepository;

    @PostMapping("/request")
    public ResponseEntity<?> sendSupportRequest(
            @RequestBody SupportRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        User sender = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Save support message
        SupportMessage message = new SupportMessage();
        message.setUser(sender);
        message.setTitle(request.getTitle());
        message.setDescription(request.getDescription());
        SupportMessage saved = supportMessageRepository.save(message);
        System.out.println("SUCCESSFULLY SAVED SupportMessage with ID: " + saved.getId());
        
        // Notify all Admins
        List<User> admins = userRepository.findAllByRole("ADMIN");
        admins.addAll(userRepository.findAllByRole("ROLE_ADMIN"));
        
        for (User admin : admins) {
            notificationService.createNotification(
                admin,
                "ADMIN_SUPPORT_REQUEST",
                "Yêu cầu hỗ trợ mới từ " + sender.getName() + ": " + request.getTitle(),
                "/admin/support" // Link to support management
            );
        }
        
        return ResponseEntity.ok().body(java.util.Map.of("message", "Yêu cầu đã được gửi tới Admin"));
    }

    @GetMapping("/all")
    public ResponseEntity<List<com.lms.backend.dto.SupportMessageDTO>> getAllSupportMessages() {
        List<SupportMessage> messages = supportMessageRepository.findAllByOrderByCreatedAtDesc();
        List<com.lms.backend.dto.SupportMessageDTO> dtos = messages.stream()
            .map(m -> com.lms.backend.dto.SupportMessageDTO.builder()
                .id(m.getId())
                .title(m.getTitle())
                .description(m.getDescription())
                .status(m.getStatus())
                .createdAt(m.getCreatedAt())
                .user(com.lms.backend.dto.SupportMessageDTO.UserInfo.builder()
                    .name(m.getUser() != null ? m.getUser().getName() : "Người dùng ẩn danh")
                    .email(m.getUser() != null ? m.getUser().getEmail() : "")
                    .phone(m.getUser() != null ? m.getUser().getPhone() : "")
                    .build())
                .build())
            .toList();
        
        System.out.println("Fetched " + dtos.size() + " support messages (DTO version).");
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROLE_ADMIN') or hasAuthority('ADMIN')")
    public ResponseEntity<?> resolveSupportMessage(@PathVariable Long id) {
        SupportMessage message = supportMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setStatus("RESOLVED");
        supportMessageRepository.save(message);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear-notifications")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> clearNotifications() {
        notificationService.clearAllNotifications();
        return ResponseEntity.ok().build();
    }
}
