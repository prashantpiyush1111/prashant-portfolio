package com.prashant.portfolio.controller;
import com.prashant.portfolio.entity.Skill;
import com.prashant.portfolio.service.SkillService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {
    private final SkillService service;
    public SkillController(SkillService service) { this.service = service; }
    @GetMapping public List<Skill> all() { return service.findAll(); }
}
