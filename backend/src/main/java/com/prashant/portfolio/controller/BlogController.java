package com.prashant.portfolio.controller;
import com.prashant.portfolio.entity.Blog;
import com.prashant.portfolio.service.BlogService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {
    private final BlogService service;
    public BlogController(BlogService service) { this.service = service; }
    @GetMapping public List<Blog> all() { return service.findAll(); }
    @GetMapping("/{id}") public Blog byId(@PathVariable Long id) { return service.findById(id); }
}
