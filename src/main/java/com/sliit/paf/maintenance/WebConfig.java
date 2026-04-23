package com.sliit.paf.maintenance;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // සියලුම API endpoints සඳහා
                // මෙතන allowedOrigins("*") පාවිච්චි කරන්න එපා, ඒ වෙනුවට මේක පාවිච්චි කරන්න:
                .allowedOriginPatterns("*") 
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); // පැයක කාලයක් සඳහා CORS settings cache කිරීමට
    }
}
