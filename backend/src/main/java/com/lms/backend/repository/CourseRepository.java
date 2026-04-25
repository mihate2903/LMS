package com.lms.backend.repository;

import com.lms.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByCategoryId(Long categoryId);
    List<Course> findByTitleContainingIgnoreCase(String title);
    List<Course> findByCategoryIdAndTitleContainingIgnoreCase(Long categoryId, String title);
}
