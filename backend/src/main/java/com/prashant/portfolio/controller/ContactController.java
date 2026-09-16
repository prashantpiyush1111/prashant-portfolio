package com.prashant.portfolio.controller;

import com.prashant.portfolio.dto.ContactRequestDto;
import com.prashant.portfolio.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    private final ContactService service;
    public ContactController(ContactService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<Map<String, Object>> submit(@Valid @RequestBody ContactRequestDto request) {
        service.save(request);
        return ResponseEntity.ok(Map.of("success", true, "message", "Message sent successfully"));
    }
}
