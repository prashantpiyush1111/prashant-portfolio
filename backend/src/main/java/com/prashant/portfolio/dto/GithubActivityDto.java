package com.prashant.portfolio.dto;

import java.time.Instant;

public record GithubActivityDto(long publicRepos, Instant createdAt) {}
