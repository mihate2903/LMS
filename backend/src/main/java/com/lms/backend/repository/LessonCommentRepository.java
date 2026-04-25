package com.lms.backend.repository;

import com.lms.backend.entity.LessonComment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LessonCommentRepository extends JpaRepository<LessonComment, Long> {
    List<LessonComment> findByLessonIdAndParentIsNullOrderByCreatedAtDesc(Long lessonId);
}
