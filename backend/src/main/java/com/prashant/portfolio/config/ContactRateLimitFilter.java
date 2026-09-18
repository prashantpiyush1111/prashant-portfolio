package com.prashant.portfolio.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ContactRateLimitFilter extends OncePerRequestFilter {
    private static final int MAX_REQUESTS = 5;
    private static final long WINDOW_SECONDS = 3600;
    private final Map<String, Deque<Long>> requests = new ConcurrentHashMap<>();
    private final String[] allowedOrigins;

    public ContactRateLimitFilter(
            @Value("${ALLOWED_ORIGIN:http://localhost:5173}") String allowedOrigin) {
        this.allowedOrigins = Arrays.stream(allowedOrigin.split(","))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .toArray(String[]::new);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (!"POST".equalsIgnoreCase(request.getMethod()) || !"/api/contact".equals(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        String ip = clientIp(request);
        long now = Instant.now().getEpochSecond();
        Deque<Long> timestamps = requests.computeIfAbsent(ip, ignored -> new ArrayDeque<>());
        synchronized (timestamps) {
            while (!timestamps.isEmpty() && now - timestamps.peekFirst() >= WINDOW_SECONDS) {
                timestamps.removeFirst();
            }
            if (timestamps.size() >= MAX_REQUESTS) {
                response.setStatus(429);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                addCorsHeaderIfAllowed(request, response);
                response.getWriter().write("{"success":false,"message":"Too many contact requests. Please try again later."}");
                return;
            }
            timestamps.addLast(now);
        }
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