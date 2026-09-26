package com.prashant.writing.entity;
import jakarta.persistence.*;
import java.time.Instant;
@Entity @Table(name="writings")
public class Writing {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=120) private String title;
 @Column(nullable=false,length=30) private String type;
 @Lob @Column(nullable=false) private String content;
 @Column(nullable=false) private boolean isPublic;
 @Column(nullable=false,updatable=false) private Instant createdAt;
 @Column(nullable=false) private Instant updatedAt;
 @PrePersist void create(){createdAt=Instant.now();updatedAt=createdAt;}
 @PreUpdate void update(){updatedAt=Instant.now();}
 public Long getId(){return id;} public String getTitle(){return title;} public String getType(){return type;}
 public String getContent(){return content;} public boolean isPublic(){return isPublic;}
 public Instant getCreatedAt(){return createdAt;} public Instant getUpdatedAt(){return updatedAt;}
 public void setTitle(String v){title=v;} public void setType(String v){type=v;} public void setContent(String v){content=v;} public void setPublic(boolean v){isPublic=v;}
}