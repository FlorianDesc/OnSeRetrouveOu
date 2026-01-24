package com.backend.OnSeRetrouveOu.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class WebConfig implements WebMvcConfigurer {
    @Value("${app.upload.photos-dir}")
    private String photosDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        System.out.println("🔥 WebConfig chargé, photosDir = " + photosDir);
        registry.addResourceHandler("/photos/**")
                .addResourceLocations("file:" + photosDir + "/");
    }
}
