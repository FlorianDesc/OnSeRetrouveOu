package com.backend.OnSeRetrouveOu.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.backend.OnSeRetrouveOu.dto.CreateActivityRequest;
import com.backend.OnSeRetrouveOu.model.Activity;
import com.backend.OnSeRetrouveOu.model.User;
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

    public Activity createActivity(CreateActivityRequest request, User creator) {
        Activity activity = new Activity();
        activity.setTitle(request.getTitle());
        activity.setDescription(request.getDescription());
        activity.setLocation(request.getLocation());
        activity.setDateActivity(request.getDateActivity());
        activity.setMaxParticipants(request.getMaxParticipants());
        activity.setCreator(creator);
        
        return activityRepository.save(activity);
    }
}