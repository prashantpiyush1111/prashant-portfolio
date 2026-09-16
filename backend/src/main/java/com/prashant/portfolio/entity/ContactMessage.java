package com.prashant.portfolio.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class ContactMessage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String email;
    private String subject;
    @Column(nullable = false, columnDefinition = "TEXT") private String message;
    @Column(nullable = false) private LocalDateTime submittedAt;

    @PrePersist
    void prePersist() { if (submittedAt == null) submittedAt = LocalDateTime.now(); }
}
