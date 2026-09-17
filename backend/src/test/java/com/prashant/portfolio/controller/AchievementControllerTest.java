package com.prashant.portfolio.controller;

import com.prashant.portfolio.entity.Achievement;
import com.prashant.portfolio.repository.AchievementRepository;
import com.prashant.portfolio.repository.BlogRepository;
import com.prashant.portfolio.repository.ProjectRepository;
import com.prashant.portfolio.repository.SkillRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AchievementController.class)
class AchievementControllerTest {
    @Autowired MockMvc mockMvc;
    @MockBean AchievementRepository repository;
    @MockBean SkillRepository skillRepository;
    @MockBean ProjectRepository projectRepository;
    @MockBean BlogRepository blogRepository;

    @Test
    void returnsAchievementsSortedByDate() throws Exception {
        Achievement old = achievement(1L, "Old", LocalDate.of(2026, 1, 1));
        Achievement recent = achievement(2L, "Recent", LocalDate.of(2026, 9, 1));
        when(repository.findAll()).thenReturn(List.of(old, recent));

        mockMvc.perform(get("/api/achievements").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Recent"))
                .andExpect(jsonPath("$[1].title").value("Old"));
    }

    private Achievement achievement(Long id, String title, LocalDate date) {
        Achievement item = new Achievement();
        item.setId(id); item.setTitle(title); item.setDescription("Description"); item.setDate(date); item.setType("experience");
        return item;
    }
}
