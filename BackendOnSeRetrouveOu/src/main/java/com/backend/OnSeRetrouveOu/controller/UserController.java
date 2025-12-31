package com.backend.OnSeRetrouveOu.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.OnSeRetrouveOu.dto.UserResponse;
import com.backend.OnSeRetrouveOu.model.User;
import com.backend.OnSeRetrouveOu.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserRepository userRepository;

  @GetMapping("/current")
  public ResponseEntity<?> getCurrentUser(Authentication authentication) {
    String username = authentication.getName();
    User user = userRepository.findByUsername(username);

    if (user == null) {
      return ResponseEntity.notFound().build();
    }

    UserResponse response = UserResponse.builder()
        .id(user.getId())
        .username(user.getUsername())
        .role(user.getRole())
        .firstname(user.getFirstname())
        .lastname(user.getLastname())
        .email(user.getEmail())
        .createdAt(user.getCreatedAt())
        .build();

    return ResponseEntity.ok(response);
  }
}
