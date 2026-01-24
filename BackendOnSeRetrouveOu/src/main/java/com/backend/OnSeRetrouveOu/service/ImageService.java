package com.backend.OnSeRetrouveOu.service;

import jakarta.annotation.PostConstruct;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageService {
    @Value("${app.upload.photos-dir}")
    private String photosDir;

    @PostConstruct
    public void debug() {
        System.out.println("PHOTOS_DIR = " + photosDir);
    }

    public String saveActivityImage(MultipartFile file) {
        validate(file);

        String filename = UUID.randomUUID() + ".jpg";
        Path dir = Paths.get(photosDir, "activities");
        Path path = dir.resolve(filename);

        try {
            Files.createDirectories(dir);

            try (InputStream is = file.getInputStream()) {
                Thumbnails.of(is)
                        .size(1280, 1280)
                        .outputQuality(0.75)
                        .toFile(path.toFile());
            }

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'enregistrement de l'image", e);
        }

        return "activities/" + filename;
    }

    private void validate(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Image vide");
        }

        if (file.getSize() > 5_000_000) {
            throw new RuntimeException("Image trop lourde (max 5MB)");
        }

        if (file.getContentType() == null ||
                !file.getContentType().startsWith("image/")) {
            throw new RuntimeException("Fichier non image");
        }
    }
}
