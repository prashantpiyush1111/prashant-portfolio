package com.prashant.writing.controller;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/access")
public class AccessController {
 private final String ownerUsername,ownerPassword,publicCode;
 public AccessController(@Value("${writing.owner.username}")String u,@Value("${writing.owner.password}")String p,@Value("${writing.public.code}")String c){ownerUsername=u;ownerPassword=p;publicCode=c;}
 @PostMapping("/owner") public ResponseEntity<?> owner(@RequestBody Credentials c){if(ownerUsername.equals(c.username())&&ownerPassword.equals(c.password()))return ResponseEntity.ok(new AccessResponse("OWNER","owner-access"));return ResponseEntity.status(401).body(new ErrorResponse("Invalid owner credentials"));}
 @PostMapping("/public") public ResponseEntity<?> publicAccess(@RequestBody PublicCode c){if(publicCode.matches("\\d{4}")&&publicCode.equals(c.code()))return ResponseEntity.ok(new AccessResponse("PUBLIC","public-access"));return ResponseEntity.status(401).body(new ErrorResponse("Invalid access code"));}
 public record Credentials(String username,String password){} public record PublicCode(String code){}
 public record AccessResponse(String role,String accessToken){} public record ErrorResponse(String error){}
}