package com.backend.OnSeRetrouveOu.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.OnSeRetrouveOu.dto.UpdatePasswordRequest;
import com.backend.OnSeRetrouveOu.dto.UpdateProfileRequest;
import com.backend.OnSeRetrouveOu.dto.UserResponse;
import com.backend.OnSeRetrouveOu.model.User;
import com.backend.OnSeRetrouveOu.repository.UserRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @GetMapping("/current")
  public ResponseEntity<?> getCurrentUser(Authentication authentication) {
    String username = authentication.getName();
    User user = userRepository.findByUsername(username);

    if (user == null) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(buildUserResponse(user));
  }

  @PutMapping("/current")
  public ResponseEntity<?> updateProfile(
      Authentication authentication,
      @RequestBody UpdateProfileRequest request) {
    String username = authentication.getName();
    User user = userRepository.findByUsername(username);

    if (user == null) {
      return ResponseEntity.notFound().build();
    }

    if (request.getFirstname() != null) {
      user.setFirstname(request.getFirstname());
    }
    if (request.getLastname() != null) {
      user.setLastname(request.getLastname());
    }
    if (request.getEmail() != null) {
      // Check if email is already used by another user
      User existingUser = userRepository.findByEmail(request.getEmail());
      if (existingUser != null && !existingUser.getId().equals(user.getId())) {
        return ResponseEntity.badRequest().body("Email already in use");
      }
      user.setEmail(request.getEmail());
    }
    if (request.getProfileImage() != null) {
      user.setProfileImage(request.getProfileImage());
    }

    userRepository.save(user);
    return ResponseEntity.ok(buildUserResponse(user));
  }

  @PutMapping("/current/password")
  public ResponseEntity<?> updatePassword(
      Authentication authentication,
      @Valid @RequestBody UpdatePasswordRequest request) {
    String username = authentication.getName();
    User user = userRepository.findByUsername(username);

    if (user == null) {
      return ResponseEntity.notFound().build();
    }

    // Verify current password
    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
      return ResponseEntity.badRequest().body("Current password is incorrect");
    }

    // Verify new passwords match
    if (!request.isPasswordMatching()) {
      return ResponseEntity.badRequest().body("New passwords do not match");
    }

    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);

    return ResponseEntity.ok().body("Password updated successfully");
  }

  private UserResponse buildUserResponse(User user) {
    return UserResponse.builder()
        .id(user.getId())
        .username(user.getUsername())
        .role(user.getRole())
        .firstname(user.getFirstname())
        .lastname(user.getLastname())
        .email(user.getEmail())
        .profileImage(user.getProfileImage())
        .createdAt(user.getCreatedAt())
        .build();
  }
}
