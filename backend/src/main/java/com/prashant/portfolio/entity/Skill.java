package com.prashant.portfolio.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Skill {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String category;
    @Column(nullable = false) private int proficiencyPercent;
}
