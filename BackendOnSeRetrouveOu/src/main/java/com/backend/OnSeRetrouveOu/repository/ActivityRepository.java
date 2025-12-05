package com.backend.OnSeRetrouveOu.repository;

import com.backend.OnSeRetrouveOu.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
}
