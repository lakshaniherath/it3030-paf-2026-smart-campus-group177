package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
<<<<<<< HEAD
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
=======
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
>>>>>>> member-01
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
<<<<<<< HEAD
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final CustomSuccessHandler customSuccessHandler;

    public SecurityConfig(CustomSuccessHandler customSuccessHandler) {
        this.customSuccessHandler = customSuccessHandler;
    }

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
                .requestMatchers("/api/notifications/**").permitAll()
                .requestMatchers("/api/chatbot/**").permitAll()
                .requestMatchers("/api/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                // අනිත් හැම එකකටම ලොග් වෙලා ඉන්න ඕනේ
                .anyRequest().authenticated()
            )
            .exceptionHandling(exception -> exception
                // Redirect වෙනවා වෙනුවට API requests වලට 401 JSON-friendly response දෙන්න
                .defaultAuthenticationEntryPointFor(
                    new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                    request -> request.getRequestURI().startsWith("/api/")
                )
            )
            .oauth2Login(oauth -> oauth
                .successHandler(customSuccessHandler)
            );

        return http.build();
    }

    // React (Frontend) එකේ ඉඳන් Backend එකට Request එවනකොට එන CORS ප්‍රශ්නය විසඳන්න මේක ඕනේ
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*", "http://127.0.0.1:*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "X-Requested-With",
            "X-User-Email"
        ));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
=======
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
>>>>>>> member-01
