package com.prashant.writing.security;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;
import java.io.IOException;
@Component
public class AccessFilter implements Filter {
 private final AccessTokenService tokens;
 public AccessFilter(AccessTokenService tokens){this.tokens=tokens;}
 public void doFilter(ServletRequest req,ServletResponse res,FilterChain chain)throws IOException,ServletException{
  HttpServletRequest r=(HttpServletRequest)req; String path=r.getRequestURI(); String method=r.getMethod();
  if(path.equals("/api/access/owner")||path.equals("/api/access/public")||method.equals("OPTIONS")){chain.doFilter(req,res);return;}
  String auth=r.getHeader("Authorization"); String token=auth!=null&&auth.startsWith("Bearer ")?auth.substring(7):null; String role=tokens.role(token);
  boolean owner=role!=null&&role.equals("OWNER"); boolean pub=role!=null&&(role.equals("PUBLIC")||owner);
  boolean allowed=path.equals("/api/writings/public")?pub:path.startsWith("/api/writings/private")?owner:path.equals("/api/writings")?owner:(path.startsWith("/api/writings/")&&owner);
  if(!allowed){((HttpServletResponse)res).sendError(HttpServletResponse.SC_UNAUTHORIZED,"Authentication required");return;}
  chain.doFilter(req,res);
 }
}