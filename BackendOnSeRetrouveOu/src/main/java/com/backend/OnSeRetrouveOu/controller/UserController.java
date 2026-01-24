package com.backend.OnSeRetrouveOu.controller;

import com.backend.OnSeRetrouveOu.dto.CreateActivityRequest;
import com.backend.OnSeRetrouveOu.dto.UpdateUserRequest;
import com.backend.OnSeRetrouveOu.model.Activity;
import com.backend.OnSeRetrouveOu.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.backend.OnSeRetrouveOu.dto.UserResponse;
import com.backend.OnSeRetrouveOu.model.User;
import com.backend.OnSeRetrouveOu.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserRepository userRepository;
  private final UserService userService;

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

    @PutMapping("/current")
    public ResponseEntity<?> updateCurrentUser(
            Authentication authentication,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User currentUser = userService.updateCurrentUser(authentication.getName(), request);
        return ResponseEntity.ok(currentUser);
    }
}
