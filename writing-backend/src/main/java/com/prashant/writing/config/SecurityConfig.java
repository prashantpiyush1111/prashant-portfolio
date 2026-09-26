package com.prashant.writing.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;
import java.util.Arrays;
import java.util.List;
@Configuration
public class SecurityConfig {
 @Bean SecurityFilterChain filter(HttpSecurity http)throws Exception{return http.csrf(c->c.disable()).cors(c->{}).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).authorizeHttpRequests(a->a.anyRequest().permitAll()).build();}
 @Bean CorsConfigurationSource cors(@Value("${writing.cors.origin}") String origin){
  CorsConfiguration c=new CorsConfiguration(); c.setAllowedOrigins(Arrays.asList(origin,"https://www.prashantpiyush1111.website","https://prashantpiyush1111.website")); c.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS")); c.setAllowedHeaders(List.of("*"));
  UrlBasedCorsConfigurationSource s=new UrlBasedCorsConfigurationSource(); s.registerCorsConfiguration("/**",c); return s;
 }
}