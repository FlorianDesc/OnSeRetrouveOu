package com.backend.OnSeRetrouveOu.exception;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        if (errors.size() == 1) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }
        
        String message = "The following fields are required: " + String.join(", ", errors.keySet());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", message));
    }

    @ExceptionHandler(InvalidFormatException.class)
    public ResponseEntity<Map<String, String>> handleInvalidFormat(InvalidFormatException ex) {

        if (ex.getTargetType().equals(LocalDate.class)) {
            return ResponseEntity.badRequest().body(
                Map.of("dateActivity", "Invalid date format. Expected YYYY-MM-DD")
            );
        }

        return ResponseEntity.badRequest().body(
            Map.of("error", "Invalid request format")
        );
    }
}
