package com.prashant.portfolio.service;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.atomic.AtomicReference;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prashant.portfolio.dto.GithubActivityDto;

@Service
public class GithubActivityService {
    private static final Duration TTL = Duration.ofMinutes(15);
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final AtomicReference<CachedActivity> cache = new AtomicReference<>();

    @Value("${github.username:prashantpiyush1111}")
    private String username;

    public GithubActivityService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public GithubActivityDto getActivity() {
        CachedActivity current = cache.get();
        if (current != null && current.cachedAt.plus(TTL).isAfter(Instant.now())) {
            return current.data;
        }

        try {
            String body = restTemplate.getForObject("https://api.github.com/users/{username}", String.class, username);
            JsonNode json = objectMapper.readTree(body);
            GithubActivityDto data = new GithubActivityDto(
                    json.path("public_repos").asLong(0),
                    json.hasNonNull("created_at") ? Instant.parse(json.get("created_at").asText()) : null
            );
            cache.set(new CachedActivity(data, Instant.now()));
            return data;
} catch (Exception ex) {
    if (current != null) {
        return current.data;
    }

    // GitHub API unavailable hone par fallback data
    return new GithubActivityDto(28, Instant.parse("2024-11-30T10:11:07Z"));
}
    }

    private record CachedActivity(GithubActivityDto data, Instant cachedAt) {}
}
