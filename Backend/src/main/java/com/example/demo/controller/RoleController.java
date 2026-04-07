package com.example.demo.controller;

import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class RoleController {
    @Autowired
    private UserService userService;

    @GetMapping("/choose-role")
    public String chooseRole() { return "role-selection"; }

    @GetMapping("/set-role")
    public String setRole(@RequestParam String role, Authentication auth) {
        OAuth2User user = (OAuth2User) auth.getPrincipal();
        userService.updateUserRole(user.getAttribute("email"), role);
        return "redirect:/dashboard";
    }
}