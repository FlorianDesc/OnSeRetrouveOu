package com.backend.OnSeRetrouveOu.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
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

    public List<User> getActivityParticipants(Long activityId) {
        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new RuntimeException("Activity not found"));

        return activity.getParticipants()
            .stream()
            .sorted(Comparator.comparing(User::getCreatedAt).reversed())
            .toList();
    }

    public Activity registerUserToActivity(Long activityId, User user) {
        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new RuntimeException("Activity not found"));
        
        if (activity.getMaxParticipants() != null && 
            activity.getParticipants().size() >= activity.getMaxParticipants()) {
            throw new RuntimeException("Activity is full");
        }
        
        if (activity.getParticipants().contains(user)) {
            throw new RuntimeException("User already registered");
        }
        
        activity.getParticipants().add(user);
        return activityRepository.save(activity);
    }

    @Transactional
    public void deleteActivity(Long activityId) {
        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new RuntimeException("Activity not found"));

        activity.getParticipants().clear();
        activityRepository.delete(activity);
    }

    public Activity updateActivity(Long activityId, CreateActivityRequest request) {
        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new RuntimeException("Activity not found"));

        activity.setTitle(request.getTitle());
        activity.setDescription(request.getDescription());
        activity.setLocation(request.getLocation());
        activity.setDateActivity(request.getDateActivity());
        activity.setMaxParticipants(request.getMaxParticipants());

        return activityRepository.save(activity);
    }
}