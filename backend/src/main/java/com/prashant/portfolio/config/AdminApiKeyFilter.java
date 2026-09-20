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
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AdminApiKeyFilter extends OncePerRequestFilter {
    private static final int MAX_FAILED_ATTEMPTS = 10;
    private static final long WINDOW_SECONDS = 900;
    private static final int CLEANUP_THRESHOLD = 10_000;

    private final String configuredKey;
    private final Map<String, Deque<Long>> failedAttempts = new ConcurrentHashMap<>();

    public AdminApiKeyFilter(@Value("${ADMIN_API_KEY:}") String configuredKey) {
        this.configuredKey = configuredKey;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (!request.getRequestURI().startsWith("/api/admin/")) {
            filterChain.doFilter(request, response);
            return;
        }

        cleanupIfNeeded();

        String ip = clientIp(request);
        long now = Instant.now().getEpochSecond();
        Deque<Long> attempts = failedAttempts.computeIfAbsent(ip, ignored -> new ArrayDeque<>());

        synchronized (attempts) {
            while (!attempts.isEmpty() && now - attempts.peekFirst() >= WINDOW_SECONDS) {
                attempts.removeFirst();
            }

            if (attempts.size() >= MAX_FAILED_ATTEMPTS) {
                rateLimited(response);
                return;
            }
        }

        String provided = request.getHeader("X-Admin-API-Key");

        if (!constantTimeEquals(configuredKey, provided)) {
            synchronized (attempts) {
                attempts.addLast(now);
            }
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"success\":false,\"message\":\"Unauthorized\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void rateLimited(HttpServletResponse response) throws IOException {
        response.setStatus(429);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"success\":false,\"message\":\"Too many failed authentication attempts. Please try again later.\"}");
    }

    private void cleanupIfNeeded() {
        if (failedAttempts.size() <= CLEANUP_THRESHOLD) return;
        long cutoff = Instant.now().getEpochSecond() - WINDOW_SECONDS;
        failedAttempts.entrySet().removeIf(entry -> {
            Deque<Long> timestamps = entry.getValue();
            synchronized (timestamps) {
                while (!timestamps.isEmpty() && timestamps.peekFirst() < cutoff) timestamps.removeFirst();
                return timestamps.isEmpty();
            }
        });
    }

    private String clientIp(HttpServletRequest request) {
        String remoteAddr = request.getRemoteAddr();
        return remoteAddr == null || remoteAddr.isBlank() ? "unknown" : remoteAddr;
    }

    private boolean constantTimeEquals(String expected, String provided) {
        if (expected == null || expected.isBlank() || provided == null) {
            return false;
        }

        byte[] expectedBytes = expected.getBytes(StandardCharsets.UTF_8);
        byte[] providedBytes = provided.getBytes(StandardCharsets.UTF_8);

        if (expectedBytes.length != providedBytes.length) {
            return false;
        }

        return MessageDigest.isEqual(expectedBytes, providedBytes);
    }
}