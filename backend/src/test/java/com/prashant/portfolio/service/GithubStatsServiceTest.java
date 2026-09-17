package com.prashant.portfolio.service;

import com.prashant.portfolio.dto.GithubStatsDto;
import com.prashant.portfolio.entity.Project;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GithubStatsServiceTest {
    @Mock RestTemplate restTemplate;
    @Mock ProjectService projectService;

    @Test
    void returnsGitHubStarsAndUpdatedAt() {
        Project project = new Project();
        project.setGithubUrl("https://github.com/example/portfolio");
        when(projectService.getProject(1L)).thenReturn(project);
        Instant updated = Instant.parse("2026-09-10T12:00:00Z");
        when(restTemplate.exchange(anyString(), any(), any(), eq(Map.class), eq("example"), eq("portfolio")))
                .thenReturn(ResponseEntity.ok(Map.of("stargazers_count", 7, "updated_at", updated.toString())));

        GithubStatsDto stats = new GithubStatsService(restTemplate, projectService).getStats(1L);

        assertEquals(7, stats.stars());
        assertEquals(updated, stats.updatedAt());
    }

    @Test
    void returnsEmptyStatsForInvalidRepositoryUrl() {
        Project project = new Project();
        project.setGithubUrl("https://example.com/not-github");
        when(projectService.getProject(1L)).thenReturn(project);

        GithubStatsDto stats = new GithubStatsService(restTemplate, projectService).getStats(1L);

        assertEquals(0, stats.stars());
        assertEquals(null, stats.updatedAt());
        verifyNoInteractions(restTemplate);
    }
}
