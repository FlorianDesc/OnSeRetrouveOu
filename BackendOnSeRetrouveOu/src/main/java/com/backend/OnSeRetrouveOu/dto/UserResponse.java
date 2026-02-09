package com.backend.OnSeRetrouveOu.dto;

import java.time.LocalDateTime;

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
  private String profileImage;
  private LocalDateTime createdAt;
}
