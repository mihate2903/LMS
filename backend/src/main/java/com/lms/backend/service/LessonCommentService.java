package com.lms.backend.service;

import com.lms.backend.dto.CommentDTO;
import java.util.List;

public interface LessonCommentService {
    List<CommentDTO> getCommentsByLesson(Long lessonId);
    CommentDTO addComment(Long lessonId, String content, Long parentId);
}
