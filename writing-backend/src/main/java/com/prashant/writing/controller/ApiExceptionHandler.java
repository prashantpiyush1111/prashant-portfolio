package com.prashant.writing.controller;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestControllerAdvice
public class ApiExceptionHandler {
 @ExceptionHandler(MethodArgumentNotValidException.class)
 @ResponseStatus(HttpStatus.BAD_REQUEST)
 public Map<String,String> validation(MethodArgumentNotValidException ex){return Map.of("error","Invalid request. Check the supplied fields.");}
 @ExceptionHandler(java.util.NoSuchElementException.class)
 @ResponseStatus(HttpStatus.NOT_FOUND)
 public Map<String,String> notFound(){return Map.of("error","Writing not found.");}
}
