package com.prashant.writing.security;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
@Service
public class AccessTokenService {
 private final Map<String,String> tokens=new ConcurrentHashMap<>();
 public String issue(String role){String token=UUID.randomUUID().toString();tokens.put(token,role);return token;}
 public String role(String token){return token==null?null:tokens.get(token);}
 public void revoke(String token){if(token!=null)tokens.remove(token);}
}