package com.prashant.portfolio.dto;

import java.time.Instant;

public record GithubStatsDto(long stars, Instant updatedAt) {}
