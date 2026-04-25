package com.lms.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    private Long id;
    private String userName;
    private String userAvatar;
    private Integer rating;
    private String content;
    private LocalDateTime createdAt;
}
