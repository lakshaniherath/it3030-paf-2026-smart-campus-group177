package com.sliit.paf.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    // පින්තූර සේව් වන ෆෝල්ඩර් එකේ නම
    private final Path root = Paths.get("uploads");

    public String saveFile(MultipartFile file) {
        try {
            // uploads ෆෝල්ඩර් එක නැත්නම් හදනවා
            if (!Files.exists(root)) {
                Files.createDirectory(root);
            }
            // පින්තූරයේ නම අද්විතීය (Unique) කරන්න UUID එකක් එකතු කරනවා
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.root.resolve(filename));
            return filename; // සේව් වුණු අලුත් නම ආපසු යවනවා
        } catch (Exception e) {
            throw new RuntimeException("පින්තූරය සේව් කරන්න බැරි වුණා: " + e.getMessage());
        }
    }
}
