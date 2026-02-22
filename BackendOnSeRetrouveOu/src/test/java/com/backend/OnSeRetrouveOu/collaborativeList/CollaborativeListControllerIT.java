package com.backend.OnSeRetrouveOu.collaborativeList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
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
import com.backend.OnSeRetrouveOu.service.CollaborativeListService;

@ExtendWith(MockitoExtension.class)
public class CollaborativeListControllerIT {
    @Mock
    ActivityRepository activityRepository;

    @Mock
    CollaborativeListItemRepository itemRepository;

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
    void addItem_participant_can_add_and_creator_is_saved() {
        when(activityRepository.findById(10L)).thenReturn(Optional.of(activity));
        when(itemRepository.save(any(CollaborativeListItem.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CollaborativeListItemRequest req = new CollaborativeListItemRequest();
        req.setTitle("Boissons");
        req.setBringText("3 packs de Coca");
        req.setStatus(CollaborativeListItemStatus.A_APPORTER);

        CollaborativeListItem created = service.addItem(10L, req, participantB);

        // Vérifie ce qui a été mis dans l'entité
        assertThat(created.getTitle()).isEqualTo("Boissons");
        assertThat(created.getBringText()).isEqualTo("3 packs de Coca");
        assertThat(created.getStatus()).isEqualTo(CollaborativeListItemStatus.A_APPORTER);
        assertThat(created.getCreator().getId()).isEqualTo(participantB.getId());
        assertThat(created.getActivity().getId()).isEqualTo(10L);

        verify(itemRepository).save(any(CollaborativeListItem.class));
    }

    @Test
    void addItem_outsider_cannot_add() {
        when(activityRepository.findById(10L)).thenReturn(Optional.of(activity));

        CollaborativeListItemRequest req = new CollaborativeListItemRequest();
        req.setTitle("Chips");
        req.setBringText("2 paquets");

        assertThatThrownBy(() -> service.addItem(10L, req, outsiderC))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("not authorized");

        verify(itemRepository, never()).save(any());
    }

    @Test
    void updateItem_only_item_creator_can_update() {
        when(activityRepository.findById(10L)).thenReturn(Optional.of(activity));

        CollaborativeListItem existing = new CollaborativeListItem();
        existing.setId(99L);
        existing.setActivity(activity);
        existing.setCreator(participantB); // item créé par bob
        existing.setTitle("Boissons");
        existing.setBringText("Coca");
        existing.setStatus(CollaborativeListItemStatus.A_APPORTER);

        when(itemRepository.findByIdAndActivityId(99L, 10L)).thenReturn(Optional.of(existing));
        when(itemRepository.save(any(CollaborativeListItem.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CollaborativeListItemRequest updateReq = new CollaborativeListItemRequest();
        updateReq.setTitle("Boissons modifiées");
        updateReq.setBringText("Ice Tea");
        updateReq.setStatus(CollaborativeListItemStatus.APPORTE);

        // ❌ alice (creator activité) essaie de modifier l'item de bob -> interdit
        assertThatThrownBy(() -> service.updateItem(10L, 99L, updateReq, creatorA))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("not authorized");

        // ✅ bob peut modifier
        CollaborativeListItem updated = service.updateItem(10L, 99L, updateReq, participantB);

        assertThat(updated.getTitle()).isEqualTo("Boissons modifiées");
        assertThat(updated.getBringText()).isEqualTo("Ice Tea");
        assertThat(updated.getStatus()).isEqualTo(CollaborativeListItemStatus.APPORTE);

        verify(itemRepository, times(1)).save(any(CollaborativeListItem.class));
    }

    @Test
    void deleteItem_only_item_creator_can_delete() {
        when(activityRepository.findById(10L)).thenReturn(Optional.of(activity));

        CollaborativeListItem existing = new CollaborativeListItem();
        existing.setId(99L);
        existing.setActivity(activity);
        existing.setCreator(participantB);

        when(itemRepository.findByIdAndActivityId(99L, 10L)).thenReturn(Optional.of(existing));

        // ❌ creator activité ne peut pas supprimer l'item de bob (si ta règle est "seul creator item")
        assertThatThrownBy(() -> service.deleteItem(10L, 99L, creatorA))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("not authorized");

        // ✅ bob peut supprimer
        service.deleteItem(10L, 99L, participantB);

        verify(itemRepository).delete(eq(existing));
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
}
