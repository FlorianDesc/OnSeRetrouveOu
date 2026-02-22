package com.backend.OnSeRetrouveOu.service;

import com.backend.OnSeRetrouveOu.dto.CollaborativeListItemRequest;
import com.backend.OnSeRetrouveOu.model.Activity;
import com.backend.OnSeRetrouveOu.model.CollaborativeListItem;
import com.backend.OnSeRetrouveOu.model.CollaborativeListItemStatus;
import com.backend.OnSeRetrouveOu.model.User;
import com.backend.OnSeRetrouveOu.repository.ActivityRepository;
import com.backend.OnSeRetrouveOu.repository.CollaborativeListItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CollaborativeListService {

    private final ActivityRepository activityRepository;
    private final CollaborativeListItemRepository itemRepository;

    public List<CollaborativeListItem> getItems(Long activityId, User currentUser) {

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        boolean isCreator = activity.getCreator() != null
                && activity.getCreator().getId().equals(currentUser.getId());

        boolean isParticipant = activity.getParticipants() != null
                && activity.getParticipants()
                .stream()
                .anyMatch(u -> u.getId().equals(currentUser.getId()));

        if (!(isCreator || isParticipant)) {
            throw new RuntimeException("You are not authorized to access this collaborative list");
        }

        return itemRepository.findByActivityId(activityId);
    }

    public CollaborativeListItem addItem(Long activityId,
                                         CollaborativeListItemRequest request,
                                         User currentUser) {

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        boolean isCreator = activity.getCreator() != null
                && activity.getCreator().getId().equals(currentUser.getId());

        boolean isParticipant = activity.getParticipants() != null
                && activity.getParticipants()
                .stream()
                .anyMatch(u -> u.getId().equals(currentUser.getId()));

        if (!(isCreator || isParticipant)) {
            throw new RuntimeException("You are not authorized to add items to this collaborative list");
        }

        CollaborativeListItem item = new CollaborativeListItem();
        item.setActivity(activity);
        item.setCreator(currentUser);
        item.setTitle(request.getTitle());
        item.setBringText(request.getBringText());
        item.setStatus(request.getStatus() != null
                ? request.getStatus()
                : CollaborativeListItemStatus.A_APPORTER);

        return itemRepository.save(item);
    }

    public CollaborativeListItem updateItem(Long activityId,
                                            Long itemId,
                                            CollaborativeListItemRequest request,
                                            User currentUser) {

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        boolean isCreator = activity.getCreator() != null
                && activity.getCreator().getId().equals(currentUser.getId());

        boolean isParticipant = activity.getParticipants() != null
                && activity.getParticipants()
                .stream()
                .anyMatch(u -> u.getId().equals(currentUser.getId()));

        if (!(isCreator || isParticipant)) {
            throw new RuntimeException("You are not authorized to update this collaborative list");
        }

        CollaborativeListItem item = itemRepository.findByIdAndActivityId(itemId, activityId)
                .orElseThrow(() -> new RuntimeException("Collaborative list item not found"));

        if (!item.getCreator().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You are not authorized to modify this item");
        }

        item.setTitle(request.getTitle());
        item.setBringText(request.getBringText());

        if (request.getStatus() != null) {
            item.setStatus(request.getStatus());
        }

        return itemRepository.save(item);
    }

    public void deleteItem(Long activityId,
                           Long itemId,
                           User currentUser) {

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        boolean isCreator = activity.getCreator() != null
                && activity.getCreator().getId().equals(currentUser.getId());

        boolean isParticipant = activity.getParticipants() != null
                && activity.getParticipants()
                .stream()
                .anyMatch(u -> u.getId().equals(currentUser.getId()));

        if (!(isCreator || isParticipant)) {
            throw new RuntimeException("You are not authorized to delete items from this collaborative list");
        }

        CollaborativeListItem item = itemRepository.findByIdAndActivityId(itemId, activityId)
                .orElseThrow(() -> new RuntimeException("Collaborative list item not found"));

        if (!item.getCreator().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You are not authorized to delete this item");
        }

        itemRepository.delete(item);
    }
}
