package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.PasswordResetService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
public class AuthController {
    
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetService passwordResetService;
    
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Smart Campus Backend API");
        response.put("status", "ok");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> login() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Please use /oauth2/authorization/google for OAuth login or /api/auth/login for email/password login");
        response.put("loginUrl", "/oauth2/authorization/google");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        if (authentication != null && authentication.isAuthenticated()) {
            try {
                OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
                response.put("user", Map.of(
                    "name", oauthUser.getAttribute("name"),
                    "email", oauthUser.getAttribute("email")
                ));
                response.put("authenticated", true);
            } catch (Exception e) {
                response.put("authenticated", false);
            }
        } else {
            response.put("authenticated", false);
            response.put("message", "Please log in first");
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            if (email == null || password == null) {
                response.put("message", "Missing required fields");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Find user by email
            Optional<User> userOptional = userService.getUserByEmail(email);
            
            if (!userOptional.isPresent()) {
                response.put("message", "Invalid email or password");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }
            
            User user = userOptional.get();
            
            // Check password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                response.put("message", "Invalid email or password");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Login successful
            response.put("message", "Login successful");
            response.put("status", "success");
            response.put("user", Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole() != null ? user.getRole() : "STUDENT"
            ));
            response.put("token", "user-" + user.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Login failed: " + e.getMessage());
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/api/auth/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String name = request.get("name");
            String email = request.get("email");
            String password = request.get("password");
            
            if (name == null || email == null || password == null) {
                response.put("message", "Missing required fields");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }
            
            User user = userService.registerUser(name, email, password);
            response.put("message", "User registered successfully");
            response.put("status", "success");
            response.put("user", Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail()
            ));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", e.getMessage());
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/api/auth/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String email = request.get("email");
            if (email == null || email.isBlank()) {
                response.put("message", "Email is required");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }

            Optional<User> userOptional = userService.getUserByEmail(email.trim());
            if (!userOptional.isPresent()) {
                response.put("message", "No account found for this email");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }

            String token = passwordResetService.createToken(email.trim());
            response.put("message", "Reset token generated. Use it to set a new password.");
            response.put("status", "success");
            response.put("resetToken", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Failed to create reset token: " + e.getMessage());
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/api/auth/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");

            if (token == null || token.isBlank() || newPassword == null || newPassword.isBlank()) {
                response.put("message", "Token and new password are required");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }

            if (newPassword.length() < 6) {
                response.put("message", "Password must be at least 6 characters");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }

            String email = passwordResetService.consumeToken(token.trim());
            if (email == null) {
                response.put("message", "Invalid or expired reset token");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }

            boolean updated = userService.updatePasswordByEmail(email, newPassword);
            if (!updated) {
                response.put("message", "User not found");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }

            response.put("message", "Password reset successful");
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Password reset failed: " + e.getMessage());
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/api/auth/oauth2/me")
    public ResponseEntity<Map<String, Object>> oauth2Me(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof OAuth2User)) {
                response.put("message", "Unauthorized");
                response.put("status", "error");
                return ResponseEntity.status(401).body(response);
            }

            OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
            String email = oauthUser.getAttribute("email");

            if (email == null || email.isBlank()) {
                response.put("message", "OAuth profile email not available");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }

            Optional<User> userOptional = userService.getUserByEmail(email);
            if (!userOptional.isPresent()) {
                response.put("message", "User not found");
                response.put("status", "error");
                return ResponseEntity.status(404).body(response);
            }

            User user = userOptional.get();
            response.put("message", "OAuth user fetched successfully");
            response.put("status", "success");
            response.put("user", Map.of(
                "id", user.getId(),
                "name", user.getName() != null ? user.getName() : oauthUser.getAttribute("name"),
                "email", user.getEmail(),
                "role", user.getRole() != null ? user.getRole() : "STUDENT"
            ));
            response.put("token", "oauth-session");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Failed to read oauth session: " + e.getMessage());
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/api/auth/user/{email}/role")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Map<String, Object>> updateUserRole(@PathVariable String email, @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String role = request.get("role");
            
            if (role == null) {
                response.put("message", "Missing role field");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }
            
            userService.updateUserRole(email, role);
            response.put("message", "User role updated successfully");
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Failed to update role: " + e.getMessage());
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }
}