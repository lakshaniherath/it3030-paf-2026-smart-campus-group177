package com.example.demo.controller;

import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
<<<<<<< HEAD
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
=======
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
>>>>>>> member-01
public class RoleController {
    @Autowired
    private UserService userService;

    @GetMapping("/choose-role")
<<<<<<< HEAD
    public ResponseEntity<Map<String, String>> chooseRole() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Select your role from the frontend");
        response.put("availableRoles", "student,teacher,admin");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/set-role")
    public ResponseEntity<Map<String, Object>> setRole(@RequestParam String role, Authentication auth) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (auth != null && auth.isAuthenticated()) {
                OAuth2User user = (OAuth2User) auth.getPrincipal();
                String email = user.getAttribute("email");
                userService.updateUserRole(email, role);
                response.put("message", "Role updated successfully");
                response.put("role", role);
                response.put("email", email);
                response.put("status", "success");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Not authenticated");
                response.put("status", "error");
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            response.put("message", e.getMessage());
            response.put("status", "error");
            return ResponseEntity.status(400).body(response);
        }
=======
    public String chooseRole() { return "role-selection"; }

    @GetMapping("/set-role")
    public String setRole(@RequestParam String role, Authentication auth) {
        OAuth2User user = (OAuth2User) auth.getPrincipal();
        userService.updateUserRole(user.getAttribute("email"), role);
        return "redirect:/dashboard";
>>>>>>> member-01
    }
}