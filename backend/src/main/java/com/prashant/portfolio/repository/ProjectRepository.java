package com.prashant.portfolio.repository;

import com.prashant.portfolio.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    boolean existsByTitleIgnoreCase(String title);
}
