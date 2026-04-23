package com.sliit.paf.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "diebas8mr",
                "api_key", "418353854967896",
                "api_secret", "XvVs_jDZzM8LeRmW1fHhTBUoJL4"
        ));
    }
}
