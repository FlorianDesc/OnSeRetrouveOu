package com.backend.OnSeRetrouveOu.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.OnSeRetrouveOu.dto.CreateActivityRequest;
import com.backend.OnSeRetrouveOu.model.Activity;
import com.backend.OnSeRetrouveOu.model.User;
import com.backend.OnSeRetrouveOu.repository.UserRepository;
import com.backend.OnSeRetrouveOu.service.ActivityService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;
    private final UserRepository userRepository;

    public ActivityController(ActivityService activityService, UserRepository userRepository) {
        this.activityService = activityService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public Page<Activity> getAllActivies(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return activityService.getAllActivities(page, size);
    }

    @PostMapping
    public ResponseEntity<?> createActivity(
        @Valid @RequestBody CreateActivityRequest request,
        Authentication authentication
    ) {
        String username = authentication.getName();
        User creator = userRepository.findByUsername(username);
        
        if (creator == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        
        Activity activity = activityService.createActivity(request, creator);
        return ResponseEntity.status(HttpStatus.CREATED).body(activity);
    }

    @GetMapping("/{id}/participants")
    public ResponseEntity<List<User>> getActivityParticipants(@PathVariable Long id) {
        List<User> participants = activityService.getActivityParticipants(id);
        return ResponseEntity.ok(participants);
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<?> registerToActivity(
        @PathVariable Long id,
        Authentication authentication
    ) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        
        Activity activity = activityService.registerUserToActivity(id, user);
        return ResponseEntity.ok(activity);
    }
}
