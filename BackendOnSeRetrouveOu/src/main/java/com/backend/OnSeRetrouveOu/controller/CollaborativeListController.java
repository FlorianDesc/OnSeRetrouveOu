package com.backend.OnSeRetrouveOu.controller;

import com.backend.OnSeRetrouveOu.dto.CollaborativeListItemRequest;
import com.backend.OnSeRetrouveOu.model.CollaborativeListItem;
import com.backend.OnSeRetrouveOu.model.User;
import com.backend.OnSeRetrouveOu.repository.UserRepository;
import com.backend.OnSeRetrouveOu.service.CollaborativeListService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class CollaborativeListController {

    private final CollaborativeListService collaborativeListService;
    private final UserRepository userRepository;

    public CollaborativeListController(CollaborativeListService collaborativeListService,
                                       UserRepository userRepository) {
        this.collaborativeListService = collaborativeListService;
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}/collaborative-list")
    public ResponseEntity<?> getCollaborativeList(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        List<CollaborativeListItem> items = collaborativeListService.getItems(id, user);
        return ResponseEntity.ok(items);
    }


    @PostMapping("/{id}/collaborative-list")
    public ResponseEntity<?> addCollaborativeListItem(@PathVariable Long id,
                                                      @Valid @RequestBody CollaborativeListItemRequest request,
                                                      Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        CollaborativeListItem created = collaborativeListService.addItem(id, request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}/collaborative-list/{itemId}")
    public ResponseEntity<?> updateCollaborativeListItem(@PathVariable Long id,
                                                         @PathVariable Long itemId,
                                                         @Valid @RequestBody CollaborativeListItemRequest request,
                                                         Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        CollaborativeListItem updated = collaborativeListService.updateItem(id, itemId, request, user);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}/collaborative-list/{itemId}")
    public ResponseEntity<?> deleteCollaborativeListItem(@PathVariable Long id,
                                                         @PathVariable Long itemId,
                                                         Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);

        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        collaborativeListService.deleteItem(id, itemId, user);
        return ResponseEntity.noContent().build();
    }
}
