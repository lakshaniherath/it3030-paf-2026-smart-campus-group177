package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // React එකෙන් Backend එකට කතා කරන නිසා CSRF disable කරනවා
            .csrf(csrf -> csrf.disable())
            // CORS settings (Frontend එකට access දෙන්න)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // මේ පාරවල් වලට ලොග් නොවී යන්න පුළුවන්
                .requestMatchers("/", "/login/**", "/oauth2/**", "/api/auth/**").permitAll()
                // අනිත් හැම එකකටම ලොග් වෙලා ඉන්න ඕනේ
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth -> oauth
                // ලොග් වුණාම HTML පිටුවකට යන්නේ නැතුව JSON එකක් යවනවා
                .successHandler((request, response, authentication) -> {
                    response.setContentType("application/json");
                    response.getWriter().write("{\"message\": \"Login Success\", \"status\": 200}");
                })
            );

        return http.build();
    }

    // React (Frontend) එකේ ඉඳන් Backend එකට Request එවනකොට එන CORS ප්‍රශ්නය විසඳන්න මේක ඕනේ
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:3001")); // React port එක (3000 or 3001 if port already in use)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}