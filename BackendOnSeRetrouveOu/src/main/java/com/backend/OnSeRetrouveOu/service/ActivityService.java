package com.backend.OnSeRetrouveOu.service;

import com.backend.OnSeRetrouveOu.model.Activity;
import com.backend.OnSeRetrouveOu.repository.ActivityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {
    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public List<Activity> getAllActivities(){
        return activityRepository.findAll();
    }
}