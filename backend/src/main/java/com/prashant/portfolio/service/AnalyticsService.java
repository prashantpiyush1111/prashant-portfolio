package com.prashant.portfolio.service;

import com.prashant.portfolio.dto.AnalyticsSummaryDto;
import com.prashant.portfolio.entity.PageView;
import com.prashant.portfolio.repository.PageViewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsService {
    private final PageViewRepository repository;

    public AnalyticsService(PageViewRepository repository) {
        this.repository = repository;
    }

    public void record(String path) {
        PageView view = new PageView();
        view.setPath(path == null || path.isBlank() ? "/" : path.substring(0, Math.min(path.length(), 500)));
        repository.save(view);
    }

    public List<AnalyticsSummaryDto> summary() {
        return repository.countViewsByPath().stream()
                .map(row -> new AnalyticsSummaryDto((String) row[0], ((Number) row[1]).longValue()))
                .toList();
    }
}
