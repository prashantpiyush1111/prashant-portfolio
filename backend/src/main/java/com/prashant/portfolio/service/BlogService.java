package com.prashant.portfolio.service;
import com.prashant.portfolio.entity.Blog;
import com.prashant.portfolio.repository.BlogRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BlogService {
    private final BlogRepository repository;
    public BlogService(BlogRepository repository) { this.repository = repository; }
    public List<Blog> findAll() { return repository.findAll(); }
    public Blog findById(Long id) { return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Blog not found: " + id)); }
}
