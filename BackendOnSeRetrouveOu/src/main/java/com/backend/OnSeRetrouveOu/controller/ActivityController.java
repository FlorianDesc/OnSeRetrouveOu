package com.backend.OnSeRetrouveOu.controller;

import com.backend.OnSeRetrouveOu.model.Activity;
import com.backend.OnSeRetrouveOu.repository.ActivityRepository;
import com.backend.OnSeRetrouveOu.service.ActivityService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public List<Activity> getAllActivies() {
        return activityService.getAllActivities();
    }
}
