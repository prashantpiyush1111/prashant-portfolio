package com.prashant.portfolio.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mock;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import com.prashant.portfolio.dto.ContactRequestDto;
import com.prashant.portfolio.repository.ContactMessageRepository;

import jakarta.mail.internet.MimeMessage;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    ContactMessageRepository repository;

    @Mock
    JavaMailSender mailSender;

    @Mock
    JavaMailSender brevoMailSender;

    @Mock
    MimeMessage mimeMessage;

    private ContactService service;

    @BeforeEach
    void setUp() {
        service = new ContactService(
                repository,
                mailSender,
                brevoMailSender,
                "",
                "test-sender@gmail.com",
                "noreply@prashantpiyush1111.website"
        );
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

        when(brevoMailSender.createMimeMessage())
                .thenReturn(mimeMessage);

        assertDoesNotThrow(() -> service.save(request()));

        verify(repository).save(any());

        verify(brevoMailSender)
                .send(mimeMessage);
    }

    @Test
    void confirmationMailFailureDoesNotFailSave() {

        when(brevoMailSender.createMimeMessage())
                .thenReturn(mimeMessage);

        doThrow(new RuntimeException("SMTP unavailable"))
                .when(brevoMailSender)
                .send(mimeMessage);

        assertDoesNotThrow(() -> service.save(request()));

        verify(repository).save(any());

        verify(brevoMailSender)
                .send(mimeMessage);
    }
}