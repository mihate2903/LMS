package com.lms.backend.service;

import com.lms.backend.dto.CourseRequest;
import com.lms.backend.dto.CourseResponse;
import com.lms.backend.dto.LessonResponse;
import com.lms.backend.entity.Category;
import com.lms.backend.entity.Course;
import com.lms.backend.repository.CategoryRepository;
import com.lms.backend.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public List<CourseResponse> getAllCourses(Long categoryId, String keyword) {
        List<Course> courses;
        boolean hasCategory = categoryId != null;
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        if (hasCategory && hasKeyword) {
            courses = courseRepository.findByCategoryIdAndTitleContainingIgnoreCase(categoryId, keyword);
        } else if (hasCategory) {
            courses = courseRepository.findByCategoryId(categoryId);
        } else if (hasKeyword) {
            courses = courseRepository.findByTitleContainingIgnoreCase(keyword);
        } else {
            courses = courseRepository.findAll();
        }

        return courses.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CourseResponse createCourse(CourseRequest request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        }

        Course course = Course.builder()
                .category(category)
                .title(request.getTitle())
                .price(request.getPrice())
                .description(request.getDescription())
                .thumbnailUrl(request.getThumbnailUrl())
                .build();

        Course savedCourse = courseRepository.save(course);
        return mapToResponse(savedCourse);
    }

    @Override
    public CourseResponse updateCourse(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        }

        course.setCategory(category);
        course.setTitle(request.getTitle());
        course.setPrice(request.getPrice());
        course.setDescription(request.getDescription());
        course.setThumbnailUrl(request.getThumbnailUrl());

        Course updatedCourse = courseRepository.save(course);
        return mapToResponse(updatedCourse);
    }

    @Override
    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
        return mapToResponse(course);
    }

    @Override
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found");
        }
        courseRepository.deleteById(id);
    }

    private CourseResponse mapToResponse(Course course) {
        List<LessonResponse> lessonResponses = null;
        if (course.getLessons() != null) {
            lessonResponses = course.getLessons().stream()
                    .map(lesson -> LessonResponse.builder()
                            .id(lesson.getId())
                            .courseId(lesson.getCourse() != null ? lesson.getCourse().getId() : null)
                            .title(lesson.getTitle())
                            // videoUrl & content bị che giấu cố ý để bảo vệ nội dung:
                            // Frontend chỉ dùng API này để vẽ Sidebar mục lục, không được lấy Video trực tiếp!
                            .videoUrl(null)
                            .content(null)
                            .lessonOrder(lesson.getLessonOrder())
                            .deletedAt(lesson.getDeletedAt())
                            .build())
                    .sorted(Comparator.comparing(LessonResponse::getLessonOrder, Comparator.nullsLast(Comparator.naturalOrder())))
                    .collect(Collectors.toList());
        }

        return CourseResponse.builder()
                .id(course.getId())
                .categoryId(course.getCategory() != null ? course.getCategory().getId() : null)
                .categoryName(course.getCategory() != null ? course.getCategory().getCategoryName() : null)
                .title(course.getTitle())
                .price(course.getPrice())
                .description(course.getDescription())
                .thumbnailUrl(course.getThumbnailUrl())
                .deletedAt(course.getDeletedAt())
                .lessons(lessonResponses)
                .build();
    }
}
