package com.backend.OnSeRetrouveOu.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    @Column(name = "date_activity")
    private LocalDate dateActivity;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    public Activity() {}

    public Activity(String title, String description, String location,
                    LocalDate dateActivity, User creator, Integer maxParticipants) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.dateActivity = dateActivity;
        this.creator = creator;
        this.maxParticipants = maxParticipants;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getLocation() { return location; }
    public LocalDate getDateActivity() { return dateActivity; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public User getCreator() { return creator; }
    public Integer getMaxParticipants() { return maxParticipants; }

    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setLocation(String location) { this.location = location; }
    public void setDateActivity(LocalDate dateActivity) { this.dateActivity = dateActivity; }
    public void setCreator(User creator) { this.creator = creator; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
}
