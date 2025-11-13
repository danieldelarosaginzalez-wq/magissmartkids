package com.altiusacademy.model.mongo;

import lombok.Data;
import java.util.List;

@Data
public class Question {
    private String id;
    private String type;
    private String text;
    private List<String> options;
    private String correctAnswer;
    private Double points;
}