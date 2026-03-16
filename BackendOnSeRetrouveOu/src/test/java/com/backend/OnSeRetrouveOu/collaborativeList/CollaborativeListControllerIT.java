package com.backend.OnSeRetrouveOu.collaborativeList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.backend.OnSeRetrouveOu.dto.CollaborativeListItemRequest;
import com.backend.OnSeRetrouveOu.model.Activity;
import com.backend.OnSeRetrouveOu.model.CollaborativeListItem;
import com.backend.OnSeRetrouveOu.model.CollaborativeListItemStatus;
import com.backend.OnSeRetrouveOu.model.User;
import com.backend.OnSeRetrouveOu.repository.ActivityRepository;
import com.backend.OnSeRetrouveOu.repository.CollaborativeListItemRepository;
import com.backend.OnSeRetrouveOu.repository.UserRepository;
import com.backend.OnSeRetrouveOu.service.CollaborativeListService;

@ExtendWith(MockitoExtension.class)
public class CollaborativeListControllerIT {
    @Mock
    ActivityRepository activityRepository;

    @Mock
    CollaborativeListItemRepository itemRepository;

    @Mock
    UserRepository userRepository;

    @InjectMocks
    CollaborativeListService service;

    private User creatorA;
    private User participantB;
    private User outsiderC;

    private Activity activity;

    @BeforeEach
    void setup() {
        creatorA = user(1L, "alice");
        participantB = user(2L, "bob");
        outsiderC = user(3L, "charlie");

        activity = new Activity();
        activity.setId(10L);
        activity.setCreator(creatorA);

        Set<User> participants = new HashSet<>();
        participants.add(participantB);
        activity.setParticipants(participants);
    }

    @Test
    void addItem_participant_can_add() {
        when(activityRepository.findById(10L)).thenReturn(Optional.of(activity));
        when(itemRepository.save(any(CollaborativeListItem.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CollaborativeListItemRequest req = new CollaborativeListItemRequest();
        req.setTitle("Boissons");
        req.setBringText("3 packs de Coca");
        req.setStatus(CollaborativeListItemStatus.EN_ATTENTE);

        CollaborativeListItem created = service.addItem(10L, req, participantB);

        // Vérifie ce qui a été mis dans l'entité
        assertThat(created.getTitle()).isEqualTo("Boissons");
        assertThat(created.getBringText()).isEqualTo("3 packs de Coca");
        assertThat(created.getStatus()).isEqualTo(CollaborativeListItemStatus.EN_ATTENTE);
        assertThat(created.getActivity().getId()).isEqualTo(10L);

        verify(itemRepository).save(any(CollaborativeListItem.class));
    }

    @Test
    void addItem_anyone_can_add() {
        when(activityRepository.findById(10L)).thenReturn(Optional.of(activity));
        when(itemRepository.save(any(CollaborativeListItem.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CollaborativeListItemRequest req = new CollaborativeListItemRequest();
        req.setTitle("Chips");
        req.setBringText("2 paquets");

        // N'importe qui peut créer une liste collaborative, même un outsider
        CollaborativeListItem created = service.addItem(10L, req, outsiderC);

        assertThat(created.getTitle()).isEqualTo("Chips");

        verify(itemRepository).save(any());
    }

    @Test
    void updateItem_any_participant_can_update() {
        when(activityRepository.findById(10L)).thenReturn(Optional.of(activity));

        CollaborativeListItem existing = new CollaborativeListItem();
        existing.setId(99L);
        existing.setActivity(activity);
        existing.setTitle("Boissons");
        existing.setBringText("Coca");
        existing.setStatus(CollaborativeListItemStatus.EN_ATTENTE);

        when(itemRepository.findByIdAndActivityId(99L, 10L)).thenReturn(Optional.of(existing));
        when(itemRepository.save(any(CollaborativeListItem.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CollaborativeListItemRequest updateReq = new CollaborativeListItemRequest();
        updateReq.setTitle("Boissons modifiées");
        updateReq.setBringText("Ice Tea");
        updateReq.setStatus(CollaborativeListItemStatus.ASSIGNE);

        // ✅ alice (creator activité) peut modifier l'item
        CollaborativeListItem updated = service.updateItem(10L, 99L, updateReq, creatorA);

        assertThat(updated.getTitle()).isEqualTo("Boissons modifiées");
        assertThat(updated.getBringText()).isEqualTo("Ice Tea");
        assertThat(updated.getStatus()).isEqualTo(CollaborativeListItemStatus.ASSIGNE);

        // ✅ bob (participant) peut aussi modifier l'item
        CollaborativeListItem updated2 = service.updateItem(10L, 99L, updateReq, participantB);
        assertThat(updated2.getTitle()).isEqualTo("Boissons modifiées");

        verify(itemRepository, times(2)).save(any(CollaborativeListItem.class));
    }

    @Test
    void deleteItem_any_participant_can_delete() {
        when(activityRepository.findById(10L)).thenReturn(Optional.of(activity));

        CollaborativeListItem existing = new CollaborativeListItem();
        existing.setId(99L);
        existing.setActivity(activity);

        when(itemRepository.findByIdAndActivityId(99L, 10L)).thenReturn(Optional.of(existing));

        // ✅ creator activité peut supprimer l'item
        service.deleteItem(10L, 99L, creatorA);
        verify(itemRepository).delete(eq(existing));

        // ✅ participant peut aussi supprimer l'item
        service.deleteItem(10L, 99L, participantB);
        verify(itemRepository, times(2)).delete(eq(existing));
    }

    // --- helper pour créer un User minimal ---
    private static User user(Long id, String username) {
        User u = new User();
        u.setId(id);
        u.setUsername(username);
        u.setRole("ROLE_USER");
        u.setPassword("x");
        u.setEmail(username + "@test.com");
        u.setFirstname(username);
        u.setLastname("L");
        return u;
    }

    @Test
    void addItem_with_assigned_user() {
        when(activityRepository.findById(10L)).thenReturn(Optional.of(activity));
        when(itemRepository.save(any(CollaborativeListItem.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(userRepository.findById(2L)).thenReturn(Optional.of(participantB));

        CollaborativeListItemRequest req = new CollaborativeListItemRequest();
        req.setTitle("Boissons");
        req.setBringText("3 packs de Coca");
        req.setAssignedUserId(2L);

        CollaborativeListItem created = service.addItem(10L, req, creatorA);

        assertThat(created.getAssignedUser()).isNotNull();
        assertThat(created.getAssignedUser().getId()).isEqualTo(2L);

        verify(itemRepository).save(any(CollaborativeListItem.class));
    }

    @Test
    void addItem_with_assigned_user_not_participant() {
        when(activityRepository.findById(10L)).thenReturn(Optional.of(activity));
        when(userRepository.findById(3L)).thenReturn(Optional.of(outsiderC));

        CollaborativeListItemRequest req = new CollaborativeListItemRequest();
        req.setTitle("Boissons");
        req.setAssignedUserId(3L);

        assertThatThrownBy(() -> service.addItem(10L, req, creatorA))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("not a participant");

        verify(itemRepository, never()).save(any());
    }
}
