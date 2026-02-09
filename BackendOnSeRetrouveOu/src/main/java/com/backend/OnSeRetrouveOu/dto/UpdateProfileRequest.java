package com.backend.OnSeRetrouveOu.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String firstname;
    private String lastname;
    private String email;
    private String profileImage;
}
