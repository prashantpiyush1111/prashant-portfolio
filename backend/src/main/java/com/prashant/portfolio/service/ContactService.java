package com.prashant.portfolio.service;

import com.prashant.portfolio.dto.ContactRequestDto;
import com.prashant.portfolio.entity.ContactMessage;
import com.prashant.portfolio.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactService {
    private final ContactMessageRepository repository;
    private final JavaMailSender mailSender;
    private final String mailTo;

    public ContactService(ContactMessageRepository repository,
                          JavaMailSender mailSender,
                          @Value("${portfolio.mail.to:}") String mailTo) {
        this.repository = repository;
        this.mailSender = mailSender;
        this.mailTo = mailTo;
    }

    public void save(ContactRequestDto request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setSubject(request.getSubject());
        message.setMessage(request.getMessage());
        repository.save(message);

        if (!mailTo.isBlank()) {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setTo(mailTo);
            email.setReplyTo(request.getEmail());
            email.setSubject("Portfolio Contact: " + request.getSubject());
            email.setText("Name: " + request.getName() + "\n"
                    + "Email: " + request.getEmail() + "\n\n"
                    + request.getMessage());
            mailSender.send(email);
        }
    }
}
