package com.prashant.portfolio.controller;

import com.prashant.portfolio.dto.GithubStatsDto;
import com.prashant.portfolio.entity.Project;
import com.prashant.portfolio.service.GithubStatsService;
import com.prashant.portfolio.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;
    private final GithubStatsService githubStatsService;

    public ProjectController(ProjectService projectService, GithubStatsService githubStatsService) {
        this.projectService = projectService;
        this.githubStatsService = githubStatsService;
    }

    @GetMapping public List<Project> getAllProjects() { return projectService.getAllProjects(); }
    @GetMapping("/{id}") public Project getProject(@PathVariable Long id) { return projectService.getProject(id); }
    @GetMapping("/{id}/github-stats") public GithubStatsDto githubStats(@PathVariable Long id) { return githubStatsService.getStats(id); }
}
