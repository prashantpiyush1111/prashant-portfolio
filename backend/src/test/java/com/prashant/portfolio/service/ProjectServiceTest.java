package com.prashant.portfolio.service;

import com.prashant.portfolio.entity.Project;
import com.prashant.portfolio.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {
    @Mock ProjectRepository repository;
    @InjectMocks ProjectService service;

    @Test void getAllProjectsReturnsRepositoryData() {
        List<Project> projects = List.of(new Project(), new Project());
        when(repository.findAll()).thenReturn(projects);
        assertEquals(2, service.getAllProjects().size());
    }

    @Test void getProjectReturnsExistingProject() {
        Project project = new Project();
        when(repository.findById(1L)).thenReturn(Optional.of(project));
        assertSame(project, service.getProject(1L));
    }

    @Test void getProjectThrowsWhenMissing() {
        when(repository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> service.getProject(99L));
    }
}
