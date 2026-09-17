package com.prashant.portfolio.service;

import com.prashant.portfolio.dto.AnalyticsSummaryDto;
import com.prashant.portfolio.repository.PageViewRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {
    @Mock PageViewRepository repository;

    @Test
    void recordNormalizesAndTruncatesPath() {
        AnalyticsService service = new AnalyticsService(repository);
        String longPath = "/" + "a".repeat(600);

        service.record(longPath);

        ArgumentCaptor<com.prashant.portfolio.entity.PageView> captor = ArgumentCaptor.forClass(com.prashant.portfolio.entity.PageView.class);
        verify(repository).save(captor.capture());
        assertEquals(500, captor.getValue().getPath().length());
    }

    @Test
    void summaryMapsRepositoryRowsToDto() {
        when(repository.countViewsByPath()).thenReturn(List.of(new Object[]{"/", 5L}, new Object[]{"/projects/1", 2L}));

        List<AnalyticsSummaryDto> result = new AnalyticsService(repository).summary();

        assertEquals(2, result.size());
        assertEquals("/", result.get(0).path());
        assertEquals(5L, result.get(0).views());
    }
}
