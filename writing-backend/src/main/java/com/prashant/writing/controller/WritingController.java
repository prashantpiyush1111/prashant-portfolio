package com.prashant.writing.controller;
import com.prashant.writing.entity.Writing;
import com.prashant.writing.repository.WritingRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/writings")
public class WritingController {
 private final WritingRepository repository;
 public WritingController(WritingRepository repository){this.repository=repository;}
 @GetMapping("/private") public List<Writing> all(){return repository.findAllByOrderByUpdatedAtDesc();}
 @GetMapping("/public") public List<Writing> publicOnly(){return repository.findByIsPublicTrueOrderByUpdatedAtDesc();}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public Writing create(@Valid @RequestBody WritingRequest r){Writing w=new Writing();apply(w,r);return repository.save(w);}
 @PutMapping("/{id}") public Writing update(@PathVariable Long id,@Valid @RequestBody WritingRequest r){Writing w=repository.findById(id).orElseThrow();apply(w,r);return repository.save(w);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){repository.deleteById(id);}
 private void apply(Writing w,WritingRequest r){w.setTitle(r.title());w.setType(r.type());w.setContent(r.content());w.setPublic(r.isPublic());}
 public record WritingRequest(@NotBlank String title,@NotBlank String type,@NotBlank String content,boolean isPublic){}
}