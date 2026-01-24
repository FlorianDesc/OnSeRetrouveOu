package com.backend.OnSeRetrouveOu.repository;

import com.backend.OnSeRetrouveOu.model.Activity;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Pageable;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    Page<Activity> findByTitleContainingIgnoreCase(
            String title,
            Pageable pageable
    );
}
