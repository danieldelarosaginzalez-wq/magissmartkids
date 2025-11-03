package com.altiusacademy.model.mongo;

import lombok.Data;
import java.util.List;

@Data
public class ActivityConfig {
    private String type;
    private Double maxScore;
    private List<Question> questions;
}