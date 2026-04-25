package com.lms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuestionRequest {
    @NotBlank(message = "Nội dung câu hỏi không được để trống")
    private String content;

    @NotBlank(message = "Đáp án A không được để trống")
    private String optionA;
    @NotBlank(message = "Đáp án B không được để trống")
    private String optionB;
    @NotBlank(message = "Đáp án C không được để trống")
    private String optionC;
    @NotBlank(message = "Đáp án D không được để trống")
    private String optionD;
    
    @NotBlank(message = "Vui lòng chọn đáp án đúng (A/B/C/D)")
    private String correctAnswer;
}
