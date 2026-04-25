package com.lms.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuizResultResponse {
    private int totalQuestions;
    private int correctAnswers;
    private int score;
    private boolean passed;
}
