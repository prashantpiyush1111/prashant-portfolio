package com.prashant.portfolio.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "project")
public class Project {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "tech_stack", nullable = false)
    private String techStack;

    private String githubUrl;
    private String liveDemoUrl;
    private String imageUrl;

    @ElementCollection
    @CollectionTable(name = "project_image_urls", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "image_url", nullable = false)
    private List<String> imageUrls = new ArrayList<>();

    @Column(nullable = false)
    private boolean featured = false;
}
