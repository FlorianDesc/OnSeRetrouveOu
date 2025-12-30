package com.backend.OnSeRetrouveOu.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.backend.OnSeRetrouveOu.model.Activity;
import com.backend.OnSeRetrouveOu.repository.ActivityRepository;

import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
@Service
public class ActivityService {
    private final ActivityRepository activityRepository;

    public Page<Activity> getAllActivities(int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        return activityRepository.findAll(pageable);
    }
}