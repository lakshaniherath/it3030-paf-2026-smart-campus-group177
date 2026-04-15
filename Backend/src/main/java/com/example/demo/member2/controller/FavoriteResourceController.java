package com.example.demo.member2.controller;

import com.example.demo.member2.service.UserContextService;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/member2/favorites")
public class FavoriteResourceController {

    private final UserContextService userContextService;
    private final UserRepository userRepository;

    public FavoriteResourceController(UserContextService userContextService, UserRepository userRepository) {
        this.userContextService = userContextService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<String>> getFavorites(Authentication authentication) {
        User user = userContextService.getCurrentUser(authentication);
        List<String> favorites = user.getFavoriteResources();
        return ResponseEntity.ok(favorites != null ? favorites : new ArrayList<>());
    }

    @PostMapping("/{resourceId}")
    public ResponseEntity<Map<String, Object>> addFavorite(
            @PathVariable String resourceId,
            Authentication authentication) {
        User user = userContextService.getCurrentUser(authentication);
        
        List<String> favorites = user.getFavoriteResources();
        if (favorites == null) {
            favorites = new ArrayList<>();
        }
        
        if (!favorites.contains(resourceId)) {
            favorites.add(resourceId);
            user.setFavoriteResources(favorites);
            userRepository.save(user);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Resource added to favorites");
        response.put("favorites", favorites);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{resourceId}")
    public ResponseEntity<Map<String, Object>> removeFavorite(
            @PathVariable String resourceId,
            Authentication authentication) {
        User user = userContextService.getCurrentUser(authentication);
        
        List<String> favorites = user.getFavoriteResources();
        if (favorites == null) {
            favorites = new ArrayList<>();
        }
        
        favorites.remove(resourceId);
        user.setFavoriteResources(favorites);
        userRepository.save(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Resource removed from favorites");
        response.put("favorites", favorites);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check/{resourceId}")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(
            @PathVariable String resourceId,
            Authentication authentication) {
        User user = userContextService.getCurrentUser(authentication);
        
        List<String> favorites = user.getFavoriteResources();
        boolean isFavorite = favorites != null && favorites.contains(resourceId);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("isFavorite", isFavorite);
        return ResponseEntity.ok(response);
    }
}
