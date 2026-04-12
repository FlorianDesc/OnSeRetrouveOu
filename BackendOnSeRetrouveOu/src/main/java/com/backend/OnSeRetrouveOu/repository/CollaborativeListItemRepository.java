package com.backend.OnSeRetrouveOu.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backend.OnSeRetrouveOu.model.CollaborativeListItem;

public interface CollaborativeListItemRepository extends JpaRepository<CollaborativeListItem, Long> {
    List<CollaborativeListItem> findByActivityId(Long activityId);
    Optional<CollaborativeListItem> findByIdAndActivityId(Long id, Long activityId);
    
    @Modifying
    @Query("DELETE FROM CollaborativeListItem c WHERE c.activity.id = :activityId")
    void deleteByActivityId(@Param("activityId") Long activityId);
}
