package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")  // Admin or Technician only
public class AdminController {
    
    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("message", "Users retrieved successfully");
            response.put("status", "success");
            response.put("users", userService.getAllUsers());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Failed to retrieve users: " + e.getMessage());
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/users/{email}")
    public ResponseEntity<Map<String, Object>> getUserByEmail(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<User> user = userService.getUserByEmail(email);
            if (user.isPresent()) {
                response.put("message", "User found");
                response.put("status", "success");
                response.put("user", user.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "User not found");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("message", "Failed to retrieve user: " + e.getMessage());
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/users/{email}/role")
    public ResponseEntity<Map<String, Object>> updateUserRole(
            @PathVariable String email,
            @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String role = request.get("role");
            if (role == null || role.isEmpty()) {
                response.put("message", "Role is required");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate role
            if (!isValidRole(role)) {
                response.put("message", "Invalid role. Allowed roles: STUDENT, LECTURER, ADMIN, TECHNICIAN");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }

            userService.updateUserRole(email, role);
            response.put("message", "User role updated successfully");
            response.put("status", "success");
            response.put("role", role);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Failed to update user role: " + e.getMessage());
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/users/{email}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        try {
            userService.deleteUser(email);
            response.put("message", "User deleted successfully");
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Failed to delete user: " + e.getMessage());
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<User> allUsers = userService.getAllUsers();
            long adminCount = allUsers.stream().filter(u -> "ADMIN".equals(u.getRole())).count();
            long studentCount = allUsers.stream().filter(u -> "STUDENT".equals(u.getRole())).count();
            long lecturerCount = allUsers.stream().filter(u -> "LECTURER".equals(u.getRole())).count();
            long technicianCount = allUsers.stream().filter(u -> "TECHNICIAN".equals(u.getRole())).count();

            response.put("message", "Admin stats retrieved successfully");
            response.put("status", "success");
            response.put("stats", Map.of(
                "totalUsers", allUsers.size(),
                "adminCount", adminCount,
                "studentCount", studentCount,
                "lecturerCount", lecturerCount,
                "technicianCount", technicianCount
            ));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Failed to retrieve stats: " + e.getMessage());
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    private boolean isValidRole(String role) {
        return role.equals("ADMIN") || role.equals("STUDENT") || 
               role.equals("LECTURER") || role.equals("TECHNICIAN");
    }
}
