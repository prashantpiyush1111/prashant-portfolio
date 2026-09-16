package com.prashant.portfolio.service;

import com.prashant.portfolio.dto.ContactRequestDto;
import com.prashant.portfolio.entity.ContactMessage;
import com.prashant.portfolio.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;

@Service
public class ContactService {
    private final ContactMessageRepository repository;
    public ContactService(ContactMessageRepository repository) { this.repository = repository; }

    public void save(ContactRequestDto request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setSubject(request.getSubject());
        message.setMessage(request.getMessage());
        repository.save(message);
    }
}
