package com.backend.OnSeRetrouveOu.service;

import com.backend.OnSeRetrouveOu.dto.UpdateUserRequest;
import com.backend.OnSeRetrouveOu.model.User;
import com.backend.OnSeRetrouveOu.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User updateCurrentUser(String username, UpdateUserRequest request) {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new EntityNotFoundException("User not found");
        }

        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setEmail(request.getEmail());

        return userRepository.save(user);
    }


}
