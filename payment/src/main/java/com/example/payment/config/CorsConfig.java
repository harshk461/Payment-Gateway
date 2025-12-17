package com.example.payment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

        @Bean
        public CorsFilter corsFilter() {
                CorsConfiguration config = new CorsConfiguration();

                config.setAllowedOrigins(Arrays.asList(
                                "http://localhost:3000", // Next.js
                                "http://localhost:3001", // SDK server
                                "http://localhost:3002",
                                "http://localhost:3090"));

                config.setAllowCredentials(true);
                config.addAllowedHeader("*");
                config.addAllowedMethod("*");

                config.setAllowedHeaders(Arrays.asList(
                                "Authorization",
                                "Content-Type",
                                "X-Requested-With",
                                "Accept",
                                "*"));

                config.setExposedHeaders(Arrays.asList(
                                "Authorization",
                                "Content-Type"));

                // VERY IMPORTANT for preflight
                config.addExposedHeader("*");

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);

                return new CorsFilter(source);
        }
}
