package com.prashant.portfolio.service;

import com.prashant.portfolio.dto.GitHubStatsDto;
import com.prashant.portfolio.entity.Project;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GitHubStatsService {
    private static final Duration TTL = Duration.ofMinutes(15);
    private final RestClient client;
    private final Map<String, CachedStats> cache = new ConcurrentHashMap<>();

    public GitHubStatsService(RestClient.Builder builder) {
        this.client = builder.baseUrl("https://api.github.com")
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.USER_AGENT, "prashant-portfolio")
                .build();
    }

    public GitHubStatsDto getStats(Project project) {
        String[] ownerRepo = parseGitHubUrl(project.getGithubUrl());
        String key = ownerRepo[0] + "/" + ownerRepo[1];
        CachedStats cached = cache.get(key);
        if (cached != null && cached.expiresAt().isAfter(Instant.now())) return cached.stats();

        GitHubResponse response = client.get()
                .uri("/repos/{owner}/{repo}", ownerRepo[0], ownerRepo[1])
                .retrieve()
                .body(GitHubResponse.class);
        if (response == null) throw new IllegalStateException("GitHub API returned an empty response");

        GitHubStatsDto stats = new GitHubStatsDto(response.stargazersCount(), response.updatedAt());
        cache.put(key, new CachedStats(stats, Instant.now().plus(TTL)));
        return stats;
    }

    private String[] parseGitHubUrl(String githubUrl) {
        if (githubUrl == null || githubUrl.isBlank()) throw new IllegalArgumentException("Project has no GitHub URL");
        URI uri = URI.create(githubUrl.trim());
        if (!"github.com".equalsIgnoreCase(uri.getHost())) throw new IllegalArgumentException("Project GitHub URL is invalid");
        String[] parts = uri.getPath().split("/");
        if (parts.length < 3 || parts[1].isBlank() || parts[2].isBlank()) throw new IllegalArgumentException("Project GitHub URL is invalid");
        return new String[]{parts[1], parts[2].replaceAll("\\.git$", "")};
    }

    private record CachedStats(GitHubStatsDto stats, Instant expiresAt) {}

    private record GitHubResponse(int stargazersCount, OffsetDateTime updatedAt) {}
}
