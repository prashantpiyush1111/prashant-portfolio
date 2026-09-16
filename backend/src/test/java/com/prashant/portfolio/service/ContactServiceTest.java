package com.prashant.portfolio.service;

import com.prashant.portfolio.dto.ContactRequestDto;
import com.prashant.portfolio.repository.ContactMessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {
    @Mock ContactMessageRepository repository;
    @Mock JavaMailSender mailSender;
    private ContactService service;

    @BeforeEach
    void setUp() {
        service = new ContactService(repository, mailSender, "");
    }

    private ContactRequestDto request() {
        ContactRequestDto dto = new ContactRequestDto();
        dto.setName("Test User");
        dto.setEmail("test@example.com");
        dto.setSubject("Hello");
        dto.setMessage("Test message");
        return dto;
    }

    @Test
    void savePersistsContactAndAttemptsConfirmationWhenAdminDestinationMissing() {
        assertDoesNotThrow(() -> service.save(request()));

        verify(repository).save(any());
        verify(mailSender).send(any(org.springframework.mail.SimpleMailMessage.class));
    }

    @Test
    void confirmationMailFailureDoesNotFailSave() {
        doThrow(new RuntimeException("SMTP unavailable"))
                .when(mailSender).send(any(org.springframework.mail.SimpleMailMessage.class));

        assertDoesNotThrow(() -> service.save(request()));

        verify(repository).save(any());
        verify(mailSender).send(any(org.springframework.mail.SimpleMailMessage.class));
    }
}
