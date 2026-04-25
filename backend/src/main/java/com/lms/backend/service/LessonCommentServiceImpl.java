package com.lms.backend.service;

import com.lms.backend.dto.CommentDTO;
import com.lms.backend.entity.Lesson;
import com.lms.backend.entity.LessonComment;
import com.lms.backend.entity.User;
import com.lms.backend.repository.LessonCommentRepository;
import com.lms.backend.repository.LessonRepository;
import com.lms.backend.repository.UserRepository;
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
public class LessonCommentServiceImpl implements LessonCommentService {
    private final LessonCommentRepository commentRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    public List<CommentDTO> getCommentsByLesson(Long lessonId) {
        return commentRepository.findByLessonIdAndParentIsNullOrderByCreatedAtDesc(lessonId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentDTO addComment(Long lessonId, String content, Long parentId) {
        CustomUserDetails principal = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = principal.getId();

        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(() -> new RuntimeException("Lesson not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        LessonComment parent = null;
        if (parentId != null) {
            parent = commentRepository.findById(parentId).orElseThrow(() -> new RuntimeException("Parent comment not found"));
        }

        LessonComment comment = LessonComment.builder()
                .lesson(lesson)
                .user(user)
                .content(content)
                .parent(parent)
                .build();
        
        LessonComment savedComment = commentRepository.save(comment);

        // Notify parent comment owner
        if (parent != null && !parent.getUser().getId().equals(userId)) {
            notificationService.createNotification(
                parent.getUser(),
                "REPLY",
                user.getName() + " đã phản hồi bình luận của bạn.",
                "/study/" + lesson.getCourse().getId() + "?lessonId=" + lesson.getId()
            );
        } else if (parent == null) {
            // Notify other commenters on the same video (if this is a top-level comment)
            List<Long> otherCommenterIds = commentRepository.findByLessonIdAndParentIsNullOrderByCreatedAtDesc(lessonId)
                .stream()
                .map(c -> c.getUser().getId())
                .filter(id -> !id.equals(userId))
                .distinct()
                .toList();
            
            for (Long recipientId : otherCommenterIds) {
                userRepository.findById(recipientId).ifPresent(recipient -> {
                    notificationService.createNotification(
                        recipient,
                        "SAME_VIDEO_COMMENT",
                        user.getName() + " cũng đã bình luận vào bài học bạn đang quan tâm.",
                        "/study/" + lesson.getCourse().getId() + "?lessonId=" + lesson.getId()
                    );
                });
            }

            // Notify all Admins about new comment on course
            List<User> admins = userRepository.findAllByRole("ADMIN");
            admins.addAll(userRepository.findAllByRole("ROLE_ADMIN"));
            for (User admin : admins) {
                if (!admin.getId().equals(userId)) { // Don't notify self
                    notificationService.createNotification(
                        admin,
                        "ADMIN_NEW_COMMENT",
                        user.getName() + " đã bình luận vào bài học '" + lesson.getTitle() + "'",
                        "/study/" + lesson.getCourse().getId() + "?lessonId=" + lesson.getId()
                    );
                }
            }
        }

        return mapToDTO(savedComment);
    }

    private CommentDTO mapToDTO(LessonComment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .userId(comment.getUser().getId())
                .userName(comment.getUser().getName())
                .userAvatar(comment.getUser().getAvatarUrl())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .replies(comment.getReplies() != null ? 
                         comment.getReplies().stream().map(this::mapToDTO).collect(Collectors.toList()) : 
                         null)
                .build();
    }
}
