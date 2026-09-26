package com.prashant.writing.controller;
import com.prashant.writing.security.AccessTokenService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
@RestController @RequestMapping("/api/access")
public class AccessController {
 private final String ownerUsername,ownerPassword,publicCode; private final AccessTokenService tokens;
 private final Map<String,Long> attempts=new ConcurrentHashMap<>();
 public AccessController(@Value("${writing.owner.username}")String u,@Value("${writing.owner.password}")String p,@Value("${writing.public.code}")String c,AccessTokenService tokens){ownerUsername=u;ownerPassword=p;publicCode=c;this.tokens=tokens;}
 @PostMapping("/owner") public ResponseEntity<?> owner(@Valid @RequestBody Credentials c){if(ownerUsername.equals(c.username())&&ownerPassword.equals(c.password()))return ResponseEntity.ok(new AccessResponse("OWNER",tokens.issue("OWNER")));return ResponseEntity.status(401).body(new ErrorResponse("Invalid owner credentials"));}
 @PostMapping("/public") public ResponseEntity<?> publicAccess(@Valid @RequestBody PublicCode c,@RequestHeader(value="X-Forwarded-For",required=false)String forwarded,@RequestHeader(value="X-Real-IP",required=false)String realIp){String ip=forwarded!=null?forwarded.split(",")[0].trim():realIp!=null?realIp:"unknown";long now=System.currentTimeMillis();long window=now/60000;String key=ip+":"+window;long count=attempts.merge(key,1L,Long::sum);if(count>5)return ResponseEntity.status(429).body(new ErrorResponse("Too many attempts. Try again later."));if(publicCode.equals(c.code()))return ResponseEntity.ok(new AccessResponse("PUBLIC",tokens.issue("PUBLIC")));return ResponseEntity.status(401).body(new ErrorResponse("Invalid access code"));}
 public record Credentials(@NotBlank String username,@NotBlank String password){} public record PublicCode(@Pattern(regexp="\\d{4}") String code){} public record AccessResponse(String role,String accessToken){} public record ErrorResponse(String error){}
}