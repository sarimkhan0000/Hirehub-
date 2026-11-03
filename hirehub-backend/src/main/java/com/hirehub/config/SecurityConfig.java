package com.hirehub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // React se POST request allow karne ke liye
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Abhi saare API links bina login ke khule rakhenge
            );
        return http.build();
    }
}