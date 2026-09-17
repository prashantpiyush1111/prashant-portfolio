package com.prashant.portfolio.repository;

import com.prashant.portfolio.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
}
