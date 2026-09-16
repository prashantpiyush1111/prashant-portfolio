package com.prashant.portfolio.controller;

import com.prashant.portfolio.entity.Project;
import com.prashant.portfolio.service.ProjectService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;
    public ProjectController(ProjectService projectService) { this.projectService = projectService; }
    @GetMapping public List<Project> getAllProjects() { return projectService.getAllProjects(); }
    @GetMapping("/{id}") public Project getProject(@PathVariable Long id) { return projectService.getProject(id); }
}
