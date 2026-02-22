package com.backend.OnSeRetrouveOu.dto;

import com.backend.OnSeRetrouveOu.model.CollaborativeListItemStatus;
import jakarta.validation.constraints.NotBlank;

public class CollaborativeListItemRequest {
    @NotBlank
    private String title;

    private String bringText;

    private CollaborativeListItemStatus status;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBringText() { return bringText; }
    public void setBringText(String bringText) { this.bringText = bringText; }

    public CollaborativeListItemStatus getStatus() { return status; }
    public void setStatus(CollaborativeListItemStatus status) { this.status = status; }
}
