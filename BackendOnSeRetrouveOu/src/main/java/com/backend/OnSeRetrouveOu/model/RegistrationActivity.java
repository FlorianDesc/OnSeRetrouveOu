package com.backend.OnSeRetrouveOu.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "registrations_activities",
        uniqueConstraints = @UniqueConstraint(columnNames = {"activity_id", "user_id"})
)
public class RegistrationActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "activity_id")
    private Activity activity;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public RegistrationActivity() {}

    public RegistrationActivity(Activity activity, User user) {
        this.activity = activity;
        this.user = user;
    }

    public Long getId() { return id; }
    public Activity getActivity() { return activity; }
    public User getUser() { return user; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setActivity(Activity activity) { this.activity = activity; }
    public void setUser(User user) { this.user = user; }
}
