package com.backend.OnSeRetrouveOu.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "collaborative_list_items")
public class CollaborativeListItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(name = "bring_text", columnDefinition = "TEXT")
    private String bringText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CollaborativeListItemStatus status = CollaborativeListItemStatus.EN_ATTENTE;

    @ManyToOne
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;


    @ManyToOne
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;
}
