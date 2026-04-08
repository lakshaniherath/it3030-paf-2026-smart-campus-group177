package com.example.demo.member2.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class UserContextService {

    private final UserRepository userRepository;

    public UserContextService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User oauth2User)) {
            throw new ResponseStatusException(UNAUTHORIZED, "Authentication required");
        }

        String email = oauth2User.getAttribute("email");
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(UNAUTHORIZED, "Authenticated user has no email");
        }

        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = new User();
            user.setEmail(email);
            user.setName(oauth2User.getAttribute("name"));
            user.setRole("USER");
            return userRepository.save(user);
        });
    }
}
