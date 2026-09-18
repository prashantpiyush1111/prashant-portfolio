package com.prashant.portfolio.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mock;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import com.prashant.portfolio.dto.ContactRequestDto;
import com.prashant.portfolio.repository.ContactMessageRepository;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    ContactMessageRepository repository;

    @Mock
    JavaMailSender mailSender;

    private ContactService service;

    @BeforeEach
    void setUp() {
        service = new ContactService(
                repository,
                mailSender,
                "",
                "test-sender@gmail.com"
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
        assertDoesNotThrow(() -> service.save(request()));

        verify(repository).save(any());

        ArgumentCaptor<SimpleMailMessage> captor =
                ArgumentCaptor.forClass(SimpleMailMessage.class);

        verify(mailSender).send(captor.capture());

        assertEquals(
                "test@example.com",
                captor.getValue().getTo()[0]
        );

        assertEquals(
                "Thanks for reaching out to Prashant Maurya",
                captor.getValue().getSubject()
        );
    }

    @Test
    void confirmationMailFailureDoesNotFailSave() {
        doThrow(new RuntimeException("SMTP unavailable"))
                .when(mailSender)
                .send(any(SimpleMailMessage.class));

        assertDoesNotThrow(() -> service.save(request()));

        verify(repository).save(any());

        verify(mailSender)
                .send(any(SimpleMailMessage.class));
    }
}