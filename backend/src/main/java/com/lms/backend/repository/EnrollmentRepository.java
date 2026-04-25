package com.lms.backend.repository;

import com.lms.backend.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Sort;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUserId(Long userId);
    Optional<Enrollment> findByUserIdAndCourseId(Long userId, Long courseId);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    
    List<Enrollment> findAll(Sort sort);
    List<Enrollment> findByStatus(String status, Sort sort);
    List<Enrollment> findByCourseId(Long courseId, Sort sort);
    List<Enrollment> findByStatusAndCourseId(String status, Long courseId, Sort sort);
    
    List<Enrollment> findByUserId(Long userId, Sort sort);
    List<Enrollment> findByStatusAndUserId(String status, Long userId, Sort sort);
}
