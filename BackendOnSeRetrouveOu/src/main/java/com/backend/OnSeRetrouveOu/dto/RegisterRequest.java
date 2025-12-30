package com.backend.OnSeRetrouveOu.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
    
    private String firstname;
    private String lastname;
    private String email;
    
    public boolean isPasswordMatching() {
        return password != null && password.equals(confirmPassword);
    }
}
