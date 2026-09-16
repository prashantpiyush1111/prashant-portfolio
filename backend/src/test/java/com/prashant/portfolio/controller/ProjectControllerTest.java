package com.prashant.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prashant.portfolio.entity.Project;
import com.prashant.portfolio.repository.BlogRepository;
import com.prashant.portfolio.repository.ProjectRepository;
import com.prashant.portfolio.repository.SkillRepository;
import com.prashant.portfolio.service.ProjectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProjectController.class)
class ProjectControllerTest {
    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockitoBean ProjectService service;

    // PortfolioApplication declares the seedData CommandLineRunner as a @Bean.
    // WebMvcTest does not load JPA repositories, so provide test doubles for
    // the runner's dependencies without changing production startup behavior.
    @MockitoBean SkillRepository skillRepository;
    @MockitoBean ProjectRepository projectRepository;
    @MockitoBean BlogRepository blogRepository;

    @Test void getAllProjectsReturnsOk() throws Exception {
        when(service.getAllProjects()).thenReturn(List.of(new Project()));
        mockMvc.perform(get("/api/projects").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }
}
