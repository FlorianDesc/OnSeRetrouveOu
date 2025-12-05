package com.backend.OnSeRetrouveOu.repository;

import com.backend.OnSeRetrouveOu.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
