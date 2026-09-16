package com.prashant.portfolio.repository;
import com.prashant.portfolio.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> { }
