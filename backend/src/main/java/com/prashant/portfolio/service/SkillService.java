package com.prashant.portfolio.service;
import com.prashant.portfolio.entity.Skill;
import com.prashant.portfolio.repository.SkillRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SkillService {
    private final SkillRepository repository;
    public SkillService(SkillRepository repository) { this.repository = repository; }
    public List<Skill> findAll() { return repository.findAll(); }
}
