package com.backend.OnSeRetrouveOu.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateActivityRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotNull(message = "Date is required")
    private LocalDate dateActivity;
    
    private Integer maxParticipants;
}
