package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/error")
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {

    @RequestMapping
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        Integer status = (Integer) request.getAttribute("jakarta.servlet.error.status_code");
        String message = (String) request.getAttribute("jakarta.servlet.error.message");
        String path = (String) request.getAttribute("jakarta.servlet.error.request_uri");
        
        response.put("timestamp", LocalDateTime.now());
        response.put("status", status != null ? status : 500);
        response.put("error", message != null ? message : "Unknown error");
        response.put("path", path != null ? path : "unknown");
        
        HttpStatus httpStatus = HttpStatus.resolve(status != null ? status : 500);
        
        return new ResponseEntity<>(response, httpStatus != null ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
