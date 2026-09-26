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
 @PostMapping("/public") public ResponseEntity<?> publicAccess(@Valid @RequestBody PublicCode c,jakarta.servlet.http.HttpServletRequest request){String ip=request.getRemoteAddr();long now=System.currentTimeMillis(),window=now/60000;String key=ip+":"+window;attempts.entrySet().removeIf(e->Long.parseLong(e.getKey().substring(e.getKey().lastIndexOf(':')+1))<window-1);long count=attempts.merge(key,1L,Long::sum);if(count>5)return ResponseEntity.status(429).body(new ErrorResponse("Too many attempts. Try again later."));if(publicCode.equals(c.code()))return ResponseEntity.ok(new AccessResponse("PUBLIC",tokens.issue("PUBLIC")));return ResponseEntity.status(401).body(new ErrorResponse("Invalid access code"));}
 @PostMapping("/logout") public ResponseEntity<Void> logout(@RequestHeader(value="Authorization",required=false)String auth){if(auth!=null&&auth.startsWith("Bearer "))tokens.revoke(auth.substring(7));return ResponseEntity.noContent().build();}
 public record Credentials(@NotBlank String username,@NotBlank String password){} public record PublicCode(@Pattern(regexp="\\d{4}") String code){} public record AccessResponse(String role,String accessToken){} public record ErrorResponse(String error){}
}