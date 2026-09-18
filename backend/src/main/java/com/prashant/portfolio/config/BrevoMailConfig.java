package com.prashant.portfolio.config;

import java.util.Properties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class BrevoMailConfig {
    @Bean("brevoMailSender")
    public JavaMailSender brevoMailSender(
            @Value("${BREVO_SMTP_HOST:}") String host,
            @Value("${BREVO_SMTP_PORT:587}") int port,
            @Value("${BREVO_SMTP_USERNAME:}") String username,
            @Value("${BREVO_SMTP_PASSWORD:}") String password) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.connectiontimeout", "5000");
        props.put("mail.smtp.timeout", "5000");
        props.put("mail.smtp.writetimeout", "5000");
        return mailSender;
    }
}