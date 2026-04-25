package com.lms.backend.service;

import com.lms.backend.dto.QuestionRequest;
import com.lms.backend.dto.QuestionResponse;
import com.lms.backend.entity.Lesson;
import com.lms.backend.entity.Question;
import com.lms.backend.repository.LessonRepository;
import com.lms.backend.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final LessonRepository lessonRepository;

    @Override
    public List<QuestionResponse> getQuestionsByLessonId(Long lessonId, boolean includeCorrectAnswer) {
        return questionRepository.findByLessonId(lessonId).stream().map(q -> 
            QuestionResponse.builder()
                .id(q.getId())
                .content(q.getContent())
                .optionA(q.getOptionA())
                .optionB(q.getOptionB())
                .optionC(q.getOptionC())
                .optionD(q.getOptionD())
                .correctAnswer(includeCorrectAnswer ? q.getCorrectAnswer() : null)
                .build()
        ).collect(Collectors.toList());
    }

    @Override
    public QuestionResponse addQuestion(Long lessonId, QuestionRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));

        Question question = Question.builder()
            .lesson(lesson)
            .content(request.getContent())
            .optionA(request.getOptionA())
            .optionB(request.getOptionB())
            .optionC(request.getOptionC())
            .optionD(request.getOptionD())
            .correctAnswer(request.getCorrectAnswer().toUpperCase())
            .build();

        question = questionRepository.save(question);
        return mapToResponse(question);
    }

    @Override
    public QuestionResponse updateQuestion(Long id, QuestionRequest request) {
        Question question = questionRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));

        question.setContent(request.getContent());
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectAnswer(request.getCorrectAnswer().toUpperCase());

        return mapToResponse(questionRepository.save(question));
    }

    @Override
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found");
        }
        questionRepository.deleteById(id);
    }

    private QuestionResponse mapToResponse(Question q) {
        return QuestionResponse.builder()
            .id(q.getId())
            .content(q.getContent())
            .optionA(q.getOptionA())
            .optionB(q.getOptionB())
            .optionC(q.getOptionC())
            .optionD(q.getOptionD())
            .correctAnswer(q.getCorrectAnswer())
            .build();
    }
}
