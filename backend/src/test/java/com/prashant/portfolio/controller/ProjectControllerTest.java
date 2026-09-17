package com.prashant.portfolio.controller;

import com.prashant.portfolio.config.WebConfig;
import com.prashant.portfolio.entity.Project;
import com.prashant.portfolio.repository.AchievementRepository;
import com.prashant.portfolio.repository.BlogRepository;
import com.prashant.portfolio.repository.ProjectRepository;
import com.prashant.portfolio.repository.SkillRepository;
import com.prashant.portfolio.service.GithubStatsService;
import com.prashant.portfolio.service.ProjectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(value = ProjectController.class, excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = WebConfig.class))
class ProjectControllerTest {
    @Autowired MockMvc mockMvc;
    @MockBean ProjectService service;
    @MockBean GithubStatsService githubStatsService;
    @MockBean SkillRepository skillRepository;
    @MockBean ProjectRepository projectRepository;
    @MockBean BlogRepository blogRepository;
    @MockBean AchievementRepository achievementRepository;

    @Test void getAllProjectsReturnsOk() throws Exception {
        when(service.getAllProjects()).thenReturn(List.of(new Project()));
        mockMvc.perform(get("/api/projects").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }
}
