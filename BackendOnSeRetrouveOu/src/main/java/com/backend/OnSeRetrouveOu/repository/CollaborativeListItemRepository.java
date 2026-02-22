package com.backend.OnSeRetrouveOu.repository;

import com.backend.OnSeRetrouveOu.model.CollaborativeListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CollaborativeListItemRepository extends JpaRepository<CollaborativeListItem, Long> {
    List<CollaborativeListItem> findByActivityId(Long activityId);
    Optional<CollaborativeListItem> findByIdAndActivityId(Long id, Long activityId);
}
