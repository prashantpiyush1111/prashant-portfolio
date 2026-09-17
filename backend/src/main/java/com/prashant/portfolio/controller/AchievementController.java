package com.prashant.portfolio.controller;

import com.prashant.portfolio.entity.Achievement;
import com.prashant.portfolio.repository.AchievementRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {
    private final AchievementRepository repository;

    public AchievementController(AchievementRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Achievement> all() {
        return repository.findAll().stream().sorted(Comparator.comparing(Achievement::getDate).reversed()).toList();
    }

    @GetMapping("/{id}")
    public Achievement one(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
}
