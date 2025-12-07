package com.backend.OnSeRetrouveOu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.OnSeRetrouveOu.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
  User findByUsername(String username);
}
