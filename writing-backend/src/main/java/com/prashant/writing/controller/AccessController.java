package com.prashant.writing.controller;
import com.prashant.writing.security.AccessTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/access")
public class AccessController {
 private final String ownerUsername,ownerPassword,publicCode; private final AccessTokenService tokens;
 public AccessController(@Value("${writing.owner.username}")String u,@Value("${writing.owner.password}")String p,@Value("${writing.public.code}")String c,AccessTokenService tokens){ownerUsername=u;ownerPassword=p;publicCode=c;this.tokens=tokens;}
 @PostMapping("/owner") public ResponseEntity<?> owner(@RequestBody Credentials c){if(ownerUsername.equals(c.username())&&ownerPassword.equals(c.password()))return ResponseEntity.ok(new AccessResponse("OWNER",tokens.issue("OWNER")));return ResponseEntity.status(401).body(new ErrorResponse("Invalid owner credentials"));}
 @PostMapping("/public") public ResponseEntity<?> publicAccess(@RequestBody PublicCode c){if(publicCode.matches("\\d{4}")&&publicCode.equals(c.code()))return ResponseEntity.ok(new AccessResponse("PUBLIC",tokens.issue("PUBLIC")));return ResponseEntity.status(401).body(new ErrorResponse("Invalid access code"));}
 public record Credentials(String username,String password){} public record PublicCode(String code){} public record AccessResponse(String role,String accessToken){} public record ErrorResponse(String error){}
}