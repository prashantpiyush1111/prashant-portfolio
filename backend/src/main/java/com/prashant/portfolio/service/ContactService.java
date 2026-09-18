package com.prashant.portfolio.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.prashant.portfolio.dto.ContactRequestDto;
import com.prashant.portfolio.entity.ContactMessage;
import com.prashant.portfolio.repository.ContactMessageRepository;

import jakarta.mail.Message;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
public class ContactService {

    private final ContactMessageRepository repository;
    private final JavaMailSender mailSender;
    private final String mailTo;
    private final String mailUsername;

    public ContactService(
            ContactMessageRepository repository,
            JavaMailSender mailSender,
            @Value("${portfolio.mail.to:}") String mailTo,
            @Value("${spring.mail.username:}") String mailUsername) {

        this.repository = repository;
        this.mailSender = mailSender;
        this.mailTo = mailTo;
        this.mailUsername = mailUsername;
    }

    public void save(ContactRequestDto request) {

        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setSubject(request.getSubject());
        message.setMessage(request.getMessage());

        repository.save(message);

        sendAdminNotification(request);
        sendConfirmation(request);
    }

    private void sendAdminNotification(ContactRequestDto request) {

        if (mailTo == null || mailTo.isBlank()) {
            return;
        }

        try {
            MimeMessage email = mailSender.createMimeMessage();

            email.setFrom(new InternetAddress(
                    mailUsername,
                    "Prashant Maurya | Portfolio"
            ));

            email.setRecipients(
                    Message.RecipientType.TO,
                    mailTo
            );

            email.setReplyTo(
                    new InternetAddress[]{
                            new InternetAddress(request.getEmail())
                    }
            );

            email.setSubject(
                    "Portfolio Contact: " + request.getSubject()
            );

            email.setText(
                    "Name: " + request.getName() + "\n"
                    + "Email: " + request.getEmail() + "\n\n"
                    + request.getMessage()
            );

            mailSender.send(email);

        } catch (Exception ignored) {
            // Contact message is already saved;
            // email failure must not fail the API request.
        }
    }

    private void sendConfirmation(ContactRequestDto request) {

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return;
        }

        try {
            SimpleMailMessage email = new SimpleMailMessage();

            email.setTo(request.getEmail());

            email.setSubject(
                    "Thanks for reaching out to Prashant Maurya"
            );

            email.setText(
                    "Hi " + request.getName() + ",\n\n"
                    + "Thanks for reaching out through my portfolio. "
                    + "I have received your message and will get back to you soon.\n\n"
                    + "Regards,\n"
                    + "Prashant Maurya"
            );

            mailSender.send(email);

        } catch (Exception ignored) {
            // Confirmation email failure must not fail the API request.
        }
    }
}