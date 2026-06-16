package com.example.demo.member2.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class UserContextService {

    private final UserRepository userRepository;

    public UserContextService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser(Authentication authentication) {
        // 1. X-User-Email header takes HIGHEST priority (local login / admin token)
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                String headerEmail = attrs.getRequest().getHeader("X-User-Email");
                if (headerEmail != null && !headerEmail.isBlank()) {
                    return userRepository.findByEmail(headerEmail)
                            .orElseGet(() -> createUser(headerEmail, headerEmail.split("@")[0], "STUDENT"));
                }
            }
        } catch (Exception ignored) {}

        // 2. Fall back to OAuth2 session (Google login without local token)
        if (authentication != null && authentication.getPrincipal() instanceof OAuth2User oauth2User) {
            String email = oauth2User.getAttribute("email");
            if (email != null && !email.isBlank()) {
                return userRepository.findByEmail(email)
                        .orElseGet(() -> createUser(email, oauth2User.getAttribute("name"), "USER"));
            }
        }

        throw new ResponseStatusException(UNAUTHORIZED, "Authentication required. Please login.");
    }

    private User createUser(String email, String name, String role) {
        User user = new User();
        user.setEmail(email);
        user.setName(name != null ? name : email.split("@")[0]);
        user.setRole(role);
        user.setProvider("local");
        user.setCreatedAt(new Date());
        return userRepository.save(user);
    }
}
