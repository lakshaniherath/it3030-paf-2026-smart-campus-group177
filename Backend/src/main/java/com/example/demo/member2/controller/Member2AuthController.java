package com.example.demo.member2.controller;

import com.example.demo.member2.service.UserContextService;
import com.example.demo.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/member2/auth")
public class Member2AuthController {

    private final UserContextService userContextService;

    public Member2AuthController(UserContextService userContextService) {
        this.userContextService = userContextService;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> me(Authentication authentication) {
        User user = userContextService.getCurrentUser(authentication);
        Map<String, String> payload = new HashMap<>();
        payload.put("id", user.getId());
        payload.put("name", user.getName());
        payload.put("email", user.getEmail());
        payload.put("role", user.getRole() == null ? "USER" : user.getRole());
        return ResponseEntity.ok(payload);
    }
}
