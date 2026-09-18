package com.prashant.portfolio.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
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

    // Gmail → admin notification
    private final JavaMailSender mailSender;

    // Brevo → visitor confirmation
    private final JavaMailSender brevoMailSender;

    private final String mailTo;
    private final String mailUsername;
    private final String brevoFromEmail;

    public ContactService(
            ContactMessageRepository repository,
            @Qualifier("mailSender") JavaMailSender mailSender,
            @Qualifier("brevoMailSender") JavaMailSender brevoMailSender,
            @Value("${portfolio.mail.to:}") String mailTo,
            @Value("${spring.mail.username:}") String mailUsername,
            @Value("${BREVO_FROM_EMAIL}") String brevoFromEmail) {

        this.repository = repository;
        this.mailSender = mailSender;
        this.brevoMailSender = brevoMailSender;
        this.mailTo = mailTo;
        this.mailUsername = mailUsername;
        this.brevoFromEmail = brevoFromEmail;
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
            // Contact message is already saved.
        }
    }

    private void sendConfirmation(ContactRequestDto request) {

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return;
        }

        try {
            MimeMessage email = brevoMailSender.createMimeMessage();

            email.setFrom(new InternetAddress(
                    brevoFromEmail,
                    "Prashant Maurya | Portfolio"
            ));

            email.setRecipients(
                    Message.RecipientType.TO,
                    request.getEmail()
            );

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

            brevoMailSender.send(email);

        } catch (Exception ignored) {
            // Confirmation email failure must not fail the API request.
        }
    }
}