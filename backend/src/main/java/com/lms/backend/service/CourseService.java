package com.lms.backend.service;

import com.lms.backend.dto.CourseRequest;
import com.lms.backend.dto.CourseResponse;

import java.util.List;

public interface CourseService {
    List<CourseResponse> getAllCourses(Long categoryId, String keyword);
    CourseResponse createCourse(CourseRequest request);
    CourseResponse updateCourse(Long id, CourseRequest request);
    CourseResponse getCourseById(Long id);
    void deleteCourse(Long id);
}
