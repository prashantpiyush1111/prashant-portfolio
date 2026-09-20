package com.prashant.portfolio.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.Data;

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
    @Column(name = "image_lqip_url")
    private String imageLqipUrl;

    @Column(columnDefinition = "TEXT")
    private String challenge;

    @Column(columnDefinition = "TEXT")
    private String solution;

    @Column(columnDefinition = "TEXT")
    private String impact;

    @ElementCollection
    @CollectionTable(name = "project_image_urls", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "image_order")
    @Column(name = "image_url", nullable = false)
    private List<String> imageUrls = new ArrayList<>();

    @Column(nullable = false)
    private boolean featured = false;
}