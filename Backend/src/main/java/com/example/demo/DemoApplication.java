package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration; // මේක එකතු කරන්න

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class}) // මෙතන exclude එක දාන්න
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}