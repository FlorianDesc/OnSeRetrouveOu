package com.backend.OnSeRetrouveOu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&_\\-]).{8,}$",
        message = "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    )
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
