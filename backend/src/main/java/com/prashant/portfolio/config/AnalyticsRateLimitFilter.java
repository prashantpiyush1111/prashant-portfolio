package com.prashant.portfolio.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Arrays;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AnalyticsRateLimitFilter extends OncePerRequestFilter {
    private final ConcurrentHashMap<String, Long> lastRequestByIp = new ConcurrentHashMap<>();
    private final String[] allowedOrigins;

    public AnalyticsRateLimitFilter(
            @Value("${ALLOWED_ORIGIN:http://localhost:5173}") String allowedOrigin) {
        this.allowedOrigins = Arrays.stream(allowedOrigin.split(","))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .toArray(String[]::new);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (!"POST".equalsIgnoreCase(request.getMethod()) || !"/api/analytics/pageview".equals(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        String ip = clientIp(request);
        long now = System.currentTimeMillis();
        Long previous = lastRequestByIp.putIfAbsent(ip, now);
        if (previous != null && now - previous < 1000) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            addCorsHeaderIfAllowed(request, response);
            response.getWriter().write("{"success":false,"message":"Too many requests"}");
            return;
        }
        lastRequestByIp.put(ip, now);
        filterChain.doFilter(request, response);
    }

    private void addCorsHeaderIfAllowed(HttpServletRequest request, HttpServletResponse response) {
        String origin = request.getHeader("Origin");
        if (origin != null && Arrays.asList(allowedOrigins).contains(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
        }
    }

    private String clientIp(HttpServletRequest request) {
        String remoteAddr = request.getRemoteAddr();
        return remoteAddr == null || remoteAddr.isBlank() ? "unknown" : remoteAddr;
    }
}