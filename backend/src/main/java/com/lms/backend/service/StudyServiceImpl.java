package com.lms.backend.service;

import com.lms.backend.dto.LessonProgressResponse;
import com.lms.backend.dto.QuizResultResponse;
import com.lms.backend.entity.Enrollment;
import com.lms.backend.entity.Lesson;
import com.lms.backend.entity.LessonProgress;
import com.lms.backend.entity.Question;
import com.lms.backend.entity.User;
import com.lms.backend.repository.EnrollmentRepository;
import com.lms.backend.repository.LessonProgressRepository;
import com.lms.backend.repository.LessonRepository;
import com.lms.backend.repository.QuestionRepository;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyServiceImpl implements StudyService {

    private final LessonRepository lessonRepository;
    private final QuestionRepository questionRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return userRepository.findById(((CustomUserDetails) principal).getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    private void checkEnrollment(User user, Lesson lesson) {
        if (user.getRole() != null && user.getRole().equalsIgnoreCase("ROLE_admin")) {
            return;
        }
        Optional<Enrollment> enrollment = enrollmentRepository.findByUserIdAndCourseId(user.getId(), lesson.getCourse().getId());
        if (enrollment.isEmpty() || !"approved".equalsIgnoreCase(enrollment.get().getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn chưa đăng ký khóa học này!");
        }
    }

    @Override
    public QuizResultResponse submitQuiz(Long lessonId, Map<Long, String> answers) {
        User user = getCurrentUser();
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));
        
        checkEnrollment(user, lesson);

        List<Question> questions = questionRepository.findByLessonId(lessonId);
        if (questions.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bài học này không có trắc nghiệm");
        }

        int correctCount = 0;
        for (Question q : questions) {
            String submittedAnswer = answers.get(q.getId());
            if (submittedAnswer != null && submittedAnswer.equalsIgnoreCase(q.getCorrectAnswer())) {
                correctCount++;
            }
        }

        int score = (int) Math.round((double) correctCount / questions.size() * 100);
        boolean passed = score >= 50; // Điểm qua bải là 50%

        LessonProgress progress = lessonProgressRepository.findByUserIdAndLessonId(user.getId(), lessonId)
            .orElse(LessonProgress.builder().user(user).lesson(lesson).build());
        
        progress.setScore(score);
        progress.setIsCompleted(passed || (progress.getIsCompleted() != null && progress.getIsCompleted()));
        lessonProgressRepository.save(progress);

        return QuizResultResponse.builder()
            .totalQuestions(questions.size())
            .correctAnswers(correctCount)
            .score(score)
            .passed(passed)
            .build();
    }

    @Override
    public LessonProgressResponse markComplete(Long lessonId) {
        User user = getCurrentUser();
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));
        
        checkEnrollment(user, lesson);

        LessonProgress progress = lessonProgressRepository.findByUserIdAndLessonId(user.getId(), lessonId)
            .orElse(LessonProgress.builder().user(user).lesson(lesson).build());
        
        progress.setIsCompleted(true);
        progress = lessonProgressRepository.save(progress);

        return LessonProgressResponse.builder()
            .lessonId(lessonId)
            .completed(true)
            .score(progress.getScore())
            .build();
    }

    @Override
    public List<LessonProgressResponse> getCourseProgress(Long courseId) {
        User user = getCurrentUser();
        return lessonProgressRepository.findByUserIdAndLessonCourseId(user.getId(), courseId).stream()
            .map(p -> LessonProgressResponse.builder()
                .lessonId(p.getLesson().getId())
                .completed(p.getIsCompleted() != null && p.getIsCompleted())
                .score(p.getScore())
                .build())
            .collect(Collectors.toList());
    }
}
