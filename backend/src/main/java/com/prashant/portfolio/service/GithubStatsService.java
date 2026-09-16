package com.prashant.portfolio.service;

import com.prashant.portfolio.dto.GithubStatsDto;
import com.prashant.portfolio.entity.Project;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GithubStatsService {
    private static final Duration TTL = Duration.ofMinutes(15);
    private final RestTemplate restTemplate;
    private final ProjectService projectService;
    private final ConcurrentHashMap<Long, CachedStats> cache = new ConcurrentHashMap<>();

    public GithubStatsService(RestTemplate restTemplate, ProjectService projectService) {
        this.restTemplate = restTemplate;
        this.projectService = projectService;
    }

    public GithubStatsDto getStats(Long projectId) {
        CachedStats cached = cache.get(projectId);
        if (cached != null && Duration.between(cached.fetchedAt(), Instant.now()).compareTo(TTL) < 0) return cached.stats();

        Project project = projectService.getProject(projectId);
        String[] repo = repositoryParts(project.getGithubUrl());
        if (repo == null) return new GithubStatsDto(0, null);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/vnd.github+json");
            headers.set("User-Agent", "prashant-portfolio");
            Map<?, ?> response = restTemplate.exchange(
                    "https://api.github.com/repos/{owner}/{repo}",
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    Map.class,
                    repo[0], repo[1]
            ).getBody();
            if (response == null) return new GithubStatsDto(0, null);
            Object starValue = response.get("stargazers_count");
            long stars = starValue instanceof Number number ? number.longValue() : 0;
            Object updated = response.get("updated_at");
            Instant updatedAt = updated == null ? null : Instant.parse(updated.toString());
            GithubStatsDto stats = new GithubStatsDto(stars, updatedAt);
            cache.put(projectId, new CachedStats(stats, Instant.now()));
            return stats;
        } catch (Exception ignored) {
            return new GithubStatsDto(0, null);
        }
    }

    private String[] repositoryParts(String githubUrl) {
        if (githubUrl == null || githubUrl.isBlank()) return null;
        String value = githubUrl.trim();
        int marker = value.indexOf("github.com/");
        if (marker < 0) return null;
        String path = value.substring(marker + "github.com/".length()).replaceAll("/+$", "");
        String[] parts = path.split("/");
        return parts.length >= 2 ? new String[]{parts[0], parts[1].replaceAll("\\.git$", "")} : null;
    }

    private record CachedStats(GithubStatsDto stats, Instant fetchedAt) {}
}
