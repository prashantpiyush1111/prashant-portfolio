package com.prashant.portfolio.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ContactRateLimitInterceptor implements HandlerInterceptor {
    private static final int MAX_REQUESTS = 5;
    private static final long WINDOW_SECONDS = 3600;
    private final Map<String, Deque<Long>> requests = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (!"POST".equalsIgnoreCase(request.getMethod()) || !request.getRequestURI().equals("/api/contact")) {
            return true;
        }

        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) ip = request.getRemoteAddr();
        ip = ip.split(",")[0].trim();

        long now = Instant.now().getEpochSecond();
        Deque<Long> timestamps = requests.computeIfAbsent(ip, key -> new ArrayDeque<>());
        synchronized (timestamps) {
            while (!timestamps.isEmpty() && now - timestamps.peekFirst() >= WINDOW_SECONDS) {
                timestamps.removeFirst();
            }
            if (timestamps.size() >= MAX_REQUESTS) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                try {
                    response.getWriter().write("{\"success\":false,\"message\":\"Too many contact requests. Please try again later.\"}");
                } catch (Exception ignored) {
                    // Response is already being rejected.
                }
                return false;
            }
            timestamps.addLast(now);
        }
        return true;
    }
}
