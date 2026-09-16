package com.prashant.portfolio.dto;

import java.time.OffsetDateTime;

public record GitHubStatsDto(int stars, OffsetDateTime updatedAt) {
}
