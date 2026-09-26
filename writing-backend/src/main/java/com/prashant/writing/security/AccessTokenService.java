package com.prashant.writing.security;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
@Service
public class AccessTokenService {
 private record Session(String role, Instant expiresAt) {}
 private final Map<String,Session> tokens=new ConcurrentHashMap<>();
 private static final long TTL_SECONDS=60L*60L*12L;
 public String issue(String role){String token=UUID.randomUUID().toString();tokens.put(token,new Session(role,Instant.now().plusSeconds(TTL_SECONDS)));return token;}
 public String role(String token){if(token==null)return null;Session s=tokens.get(token);if(s==null)return null;if(s.expiresAt().isBefore(Instant.now())){tokens.remove(token);return null;}return s.role();}
 public void revoke(String token){if(token!=null)tokens.remove(token);}
}