package com.prashant.portfolio.service;

import com.prashant.portfolio.dto.ContactRequestDto;
import com.prashant.portfolio.repository.ContactMessageRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {
    @Mock ContactMessageRepository repository;
    @Mock JavaMailSender mailSender;
    @InjectMocks ContactService service;

    @Test void savePersistsContactWithoutMailWhenDestinationMissing() {
        ContactRequestDto dto = new ContactRequestDto();
        dto.setName("Test User");
        dto.setEmail("test@example.com");
        dto.setSubject("Hello");
        dto.setMessage("Test message");
        assertDoesNotThrow(() -> service.save(dto));
        verify(repository).save(any());
        verifyNoInteractions(mailSender);
    }
}
