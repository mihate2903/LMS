package com.lms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    
    // Thường là kí tự A, B, C, D
    @Column(name = "correct_answer", length = 1)
    private String correctAnswer;
}
