package com.backend.OnSeRetrouveOu.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @ManyToOne
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;
}
