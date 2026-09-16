package com.prashant.portfolio.controller;

import com.prashant.portfolio.service.AnalyticsService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    public record PageViewRequest(@Size(max = 500) String path) {}

    @PostMapping("/pageview")
    public void pageView(@Valid @RequestBody PageViewRequest request) {
        analyticsService.record(request.path());
    }
}
