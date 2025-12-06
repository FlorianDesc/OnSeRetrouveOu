package com.backend.OnSeRetrouveOu.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.OnSeRetrouveOu.model.Activity;
import com.backend.OnSeRetrouveOu.repository.ActivityRepository;

import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
@Service
public class ActivityService {
    private final ActivityRepository activityRepository;

    public List<Activity> getAllActivities(){
        return activityRepository.findAll();
    }
}