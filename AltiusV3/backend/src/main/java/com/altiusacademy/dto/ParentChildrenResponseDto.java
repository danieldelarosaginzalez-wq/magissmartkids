package com.altiusacademy.dto;

import java.util.List;

public class ParentChildrenResponseDto {
    private List<ParentChildDto> children;
    
    public ParentChildrenResponseDto() {}
    
    // Getters and Setters
    public List<ParentChildDto> getChildren() {
        return children;
    }
    
    public void setChildren(List<ParentChildDto> children) {
        this.children = children;
    }
}