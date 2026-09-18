package com.prashant.portfolio.exception;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import jakarta.persistence.EntityNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private Map<String, Object> body(
            int status,
            String error,
            String message) {

        return Map.of(
                "timestamp", Instant.now().toString(),
                "status", status,
                "error", error,
                "message", message
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<?> validation(MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return ResponseEntity
                .badRequest()
                .body(body(400, "Bad Request", message));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    ResponseEntity<?> notFound(EntityNotFoundException ex) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(body(
                        404,
                        "Not Found",
                        ex.getMessage()
                ));
    }

    @ExceptionHandler({
            NoHandlerFoundException.class,
            NoResourceFoundException.class
    })
    ResponseEntity<?> routeNotFound(Exception ex) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(body(
                        404,
                        "Not Found",
                        "The requested API resource was not found"
                ));
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<?> generic(Exception ex) {

        // Actual exception Render logs me show hoga
        log.error("Unhandled exception in API", ex);

        // User ko generic safe message hi milega
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(body(
                        500,
                        "Internal Server Error",
                        "Something went wrong"
                ));
    }
}