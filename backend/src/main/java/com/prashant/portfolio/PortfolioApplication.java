package com.prashant.portfolio;

import com.prashant.portfolio.entity.Achievement;
import com.prashant.portfolio.entity.Blog;
import com.prashant.portfolio.entity.Project;
import com.prashant.portfolio.entity.Skill;
import com.prashant.portfolio.repository.AchievementRepository;
import com.prashant.portfolio.repository.BlogRepository;
import com.prashant.portfolio.repository.ProjectRepository;
import com.prashant.portfolio.repository.SkillRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
public class PortfolioApplication {
    public static void main(String[] args) { SpringApplication.run(PortfolioApplication.class, args); }

    @Bean
    CommandLineRunner seedData(SkillRepository skillRepository, ProjectRepository projectRepository, BlogRepository blogRepository, AchievementRepository achievementRepository) {
        return args -> {
            List<Skill> seedSkills = List.of(
                skill("Java", "Backend", 90), skill("Spring Boot", "Backend", 85), skill("Spring Security", "Backend", 75), skill("JWT", "Backend", 75), skill("Hibernate/JPA", "Backend", 80), skill("MySQL", "Database", 85), skill("React.js", "Frontend", 75), skill("Git", "Tools", 85), skill("Maven", "Tools", 80), skill("Postman", "Tools", 80));
            seedSkills.stream().filter(seed -> !skillRepository.existsByNameIgnoreCase(seed.getName())).forEach(skillRepository::save);

            if (projectRepository.count() == 0) {
                projectRepository.saveAll(List.of(
                    project("AI-Driven Sales Forecasting", "AI-powered sales forecasting platform with business intelligence dashboards and predictive insights.", "Java, Spring Boot, MySQL, React, Python, FastAPI", "https://github.com/prashantpiyush1111/AI-Driven-Sales-Forecasting", "https://github.com/prashantpiyush1111/AI-Driven-Sales-Forecasting", "/projects/ai-sales-forecasting.png", true, List.of("/projects/ai-sales-forecasting.png"), "Build a reliable forecasting workflow that connects business data, predictions and decision-ready insights.", "Designed the Spring Boot API and integrated the application layers around a MySQL-backed data model and AI services.", "A single full-stack workflow for exploring forecasts and business intelligence insights."),
                    project("RAG Educational Assistant", "Educational assistant that retrieves relevant knowledge and generates grounded answers from learning resources.", "Java, Spring Boot, React, Python, RAG, Qdrant", "https://github.com/prashantpiyush1111/rag-educational-system", "https://github.com/prashantpiyush1111/rag-educational-system", "/projects/rag-educational-assistant.png", true, List.of("/projects/rag-educational-assistant.png"), "Make learning resources easier to query while keeping generated answers grounded in retrieved context.", "Combined a React interface, Spring Boot backend and RAG service with vector retrieval.", "A practical AI-assisted learning workflow with traceable retrieved context."),
                    project("Task Management System", "Jira-style task management system with assignments, role-based permissions, deadlines, and collaboration.", "Java, Spring Boot, MySQL, React, JWT", "https://github.com/prashantpiyush1111/task-management-system", "https://github.com/prashantpiyush1111/task-management-system", "/projects/task-management-system.png", false, List.of("/projects/task-management-system.png"), "Bring task assignment, permissions, deadlines and progress into one maintainable application.", "Built the backend around Spring Boot, MySQL and JWT-based access control with a React frontend.", "A structured project workflow covering task ownership, deadlines and progress reporting."));
            }
            if (blogRepository.count() == 0) {
                Blog first = blog("Building REST APIs with Spring Boot", "A practical overview of clean REST API design with Spring Boot.", "Spring Boot makes it straightforward to build maintainable REST APIs. Start with resource-focused controllers, move business rules into services, and keep persistence concerns inside repositories. Validate incoming data at the boundary and return consistent error responses.", LocalDate.of(2026, 8, 20), "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80");
                Blog second = blog("Spring Data JPA: From Entity to Repository", "How JPA entities and repositories simplify database access in Java applications.", "Spring Data JPA removes much of the repetitive persistence code. Define an entity that models your table, create a JpaRepository, and let Spring generate common CRUD operations. As the project grows, put domain logic in services and keep controllers thin.", LocalDate.of(2026, 9, 5), "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80");
                blogRepository.saveAll(List.of(first, second));
            }
            List<Achievement> seedAchievements = List.of(achievement("Java Full Stack Development", "Building production-oriented applications with Java, Spring Boot, React and MySQL.", LocalDate.of(2026, 9, 1), "experience"), achievement("AI-Driven Sales Forecasting", "Developing a full-stack forecasting platform with a Spring Boot backend and AI services.", LocalDate.of(2026, 8, 15), "experience"), achievement("Full Stack Engineering Focus", "Hands-on work across REST APIs, authentication, databases, frontend systems and deployment workflows.", LocalDate.of(2026, 7, 1), "certification"));
            seedAchievements.stream().filter(seed -> !achievementRepository.existsByTitleIgnoreCase(seed.getTitle())).forEach(achievementRepository::save);
        };
    }
    private static Skill skill(String name, String category, int proficiency) { Skill s = new Skill(); s.setName(name); s.setCategory(category); s.setProficiencyPercent(proficiency); return s; }
    private static Project project(String title, String description, String techStack, String githubUrl, String liveDemoUrl, String imageUrl, boolean featured, List<String> imageUrls, String challenge, String solution, String impact) { Project p = new Project(); p.setTitle(title); p.setDescription(description); p.setTechStack(techStack); p.setGithubUrl(githubUrl); p.setLiveDemoUrl(liveDemoUrl); p.setImageUrl(imageUrl); p.setImageUrls(imageUrls); p.setFeatured(featured); p.setChallenge(challenge); p.setSolution(solution); p.setImpact(impact); return p; }
    private static Blog blog(String title, String summary, String content, LocalDate date, String thumbnailUrl) { Blog b = new Blog(); b.setTitle(title); b.setSummary(summary); b.setContent(content); b.setPublishedDate(date); b.setThumbnailUrl(thumbnailUrl); return b; }
    private static Achievement achievement(String title, String description, LocalDate date, String type) { Achievement a = new Achievement(); a.setTitle(title); a.setDescription(description); a.setDate(date); a.setType(type); return a; }
}
