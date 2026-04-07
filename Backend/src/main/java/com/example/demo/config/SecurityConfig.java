package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Enable our custom CORS configuration first to handle OPTIONS preflight
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Disable CSRF purely for development/testing REST APIs safely across domains
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Explicitly allow all traffic into the resources API (Member 1) without Google Auth interception.
                .requestMatchers("/api/resources/**").permitAll()
                // Require authentication for anything else (Member 2/3 endpoints if they exist)
                .anyRequest().authenticated()
            )
            // Still retain OAuth2 functionality for other members who wanted Google Login
            .oauth2Login(oauth2 -> {});
            
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow the React frontend URL
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://127.0.0.1:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this completely open CORS policy natively at the HttpSecurity filter level
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
