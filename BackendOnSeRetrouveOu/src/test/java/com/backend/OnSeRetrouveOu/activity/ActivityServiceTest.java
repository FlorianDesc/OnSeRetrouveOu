package com.backend.OnSeRetrouveOu.activity;

import com.backend.OnSeRetrouveOu.model.Activity;
import com.backend.OnSeRetrouveOu.model.ActivitySort;
import com.backend.OnSeRetrouveOu.service.ActivityService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;

import java.util.Comparator;
import java.util.List;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

@SpringBootTest
public class ActivityServiceTest {
    @Autowired
    private ActivityService activityService;

    @Test
    void shouldSortByDateRecent() {
        Page<Activity> page = activityService
                .getAllActivities(0, 10, ActivitySort.DATE_RECENT);

        List<Activity> activities = page.getContent();

        assertThat(activities).isSortedAccordingTo(
                Comparator.comparing(Activity::getCreatedAt).reversed()
        );
    }

    @Test
    void shouldSortByTitleAZ() {
        Page<Activity> page = activityService
                .getAllActivities(0, 10, ActivitySort.ALPHA_AZ);

        List<Activity> activities = page.getContent();

        assertThat(activities).isSortedAccordingTo(
                Comparator.comparing(Activity::getTitle)
        );
    }
}
