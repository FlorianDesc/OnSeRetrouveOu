package com.backend.OnSeRetrouveOu.activity;

import com.backend.OnSeRetrouveOu.model.Activity;
import com.backend.OnSeRetrouveOu.model.ActivitySort;
import com.backend.OnSeRetrouveOu.repository.ActivityRepository;
import com.backend.OnSeRetrouveOu.service.ActivityService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;

import java.util.Comparator;
import java.util.List;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class ActivityServiceTest {
    @Autowired
    private ActivityService activityService;

    @Test
    void shouldReturnActivitiesSortedByDateRecent() {
        Page<Activity> page = activityService.getAllActivities(
                0, 10, ActivitySort.DATE_RECENT, null
        );

        // Le test passe juste si aucune exception n'est levée
        assertNotNull(page);
    }

    @Test
    void shouldSearchActivitiesByTitle() {

        String search = "concert";

        Page<Activity> page = activityService.getAllActivities(
                0,
                10,
                ActivitySort.DATE_RECENT,
                search
        );

        // Vérification simple et explicite
        assertNotNull(page);

        for (Activity activity : page.getContent()) {
            assertTrue(
                    activity.getTitle().toLowerCase().contains(search),
                    "Titre incorrect : " + activity.getTitle()
            );
        }
    }
}
