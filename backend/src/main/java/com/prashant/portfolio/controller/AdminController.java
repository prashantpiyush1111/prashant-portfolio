package com.prashant.portfolio.controller;

import com.prashant.portfolio.dto.AnalyticsSummaryDto;
import com.prashant.portfolio.entity.Blog;
import com.prashant.portfolio.entity.Project;
import com.prashant.portfolio.entity.Skill;
import com.prashant.portfolio.repository.BlogRepository;
import com.prashant.portfolio.repository.ProjectRepository;
import com.prashant.portfolio.repository.SkillRepository;
import com.prashant.portfolio.service.AnalyticsService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final BlogRepository blogRepository;
    private final AnalyticsService analyticsService;

    public AdminController(SkillRepository skillRepository, ProjectRepository projectRepository, BlogRepository blogRepository, AnalyticsService analyticsService) {
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
        this.blogRepository = blogRepository;
        this.analyticsService = analyticsService;
    }

    @GetMapping("/skills") public List<Skill> skills() { return skillRepository.findAll(); }
    @PostMapping("/skills") public Skill addSkill(@RequestBody Skill skill) { skill.setId(null); return skillRepository.save(skill); }
    @PutMapping("/skills/{id}") public Skill updateSkill(@PathVariable Long id, @RequestBody Skill skill) { skill.setId(id); return skillRepository.save(skill); }
    @DeleteMapping("/skills/{id}") public void deleteSkill(@PathVariable Long id) { if (!skillRepository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND); skillRepository.deleteById(id); }

    @GetMapping("/projects") public List<Project> projects() { return projectRepository.findAll(); }
    @PostMapping("/projects") public Project addProject(@RequestBody Project project) { project.setId(null); return projectRepository.save(project); }
    @PutMapping("/projects/{id}") public Project updateProject(@PathVariable Long id, @RequestBody Project project) { project.setId(id); return projectRepository.save(project); }
    @DeleteMapping("/projects/{id}") public void deleteProject(@PathVariable Long id) { if (!projectRepository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND); projectRepository.deleteById(id); }

    @GetMapping("/blogs") public List<Blog> blogs() { return blogRepository.findAll(); }
    @PostMapping("/blogs") public Blog addBlog(@RequestBody Blog blog) { blog.setId(null); return blogRepository.save(blog); }
    @PutMapping("/blogs/{id}") public Blog updateBlog(@PathVariable Long id, @RequestBody Blog blog) { blog.setId(id); return blogRepository.save(blog); }
    @DeleteMapping("/blogs/{id}") public void deleteBlog(@PathVariable Long id) { if (!blogRepository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND); blogRepository.deleteById(id); }

    @GetMapping("/analytics/summary") public List<AnalyticsSummaryDto> analyticsSummary() { return analyticsService.summary(); }
}
