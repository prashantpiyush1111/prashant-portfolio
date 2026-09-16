package com.prashant.portfolio.repository;
import com.prashant.portfolio.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
public interface BlogRepository extends JpaRepository<Blog, Long> { }
