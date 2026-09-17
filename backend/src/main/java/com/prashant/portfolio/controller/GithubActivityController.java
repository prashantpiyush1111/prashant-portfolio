package com.prashant.portfolio.controller;

import com.prashant.portfolio.dto.GithubActivityDto;
import com.prashant.portfolio.service.GithubActivityService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/github")
public class GithubActivityController {
    private final GithubActivityService service;

    public GithubActivityController(GithubActivityService service) {
        this.service = service;
    }

    @GetMapping("/activity")
    public GithubActivityDto activity() {
        return service.getActivity();
    }
}
