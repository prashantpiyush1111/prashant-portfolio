package com.prashant.portfolio.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
public class Blog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String title;
    private String summary;
    @Column(columnDefinition = "TEXT") private String content;
    private LocalDate publishedDate;
    private String thumbnailUrl;
}
