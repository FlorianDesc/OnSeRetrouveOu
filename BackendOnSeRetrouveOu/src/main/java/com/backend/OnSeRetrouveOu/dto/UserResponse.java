package com.backend.OnSeRetrouveOu.dto;

import java.time.LocalDateTime;

import com.backend.OnSeRetrouveOu.model.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
  private Long id;
  private String username;
  private String role;
  private String firstname;
  private String lastname;
  private String email;
  private LocalDateTime createdAt;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
