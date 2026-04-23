package com.sliit.paf.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@Service
public class FileStorageService {

    @Autowired
    private Cloudinary cloudinaryConfig; // SmartCampusApplication එකේ bean එකේ නමට සමාන විය යුතුයි

    /**
     * පින්තූරයක් Cloudinary වෙත upload කර එහි URL එක ලබා දෙයි.
     */
    public String uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            // Cloudinary වෙත upload කිරීම
            Map<?, ?> uploadResult = cloudinaryConfig.uploader().upload(file.getBytes(), 
                ObjectUtils.asMap("folder", "paf_uploads"));

            // Upload වූ පසු ලැබෙන URL එක ලබා ගැනීම
            // මෙහිදී "secure_url" (https) භාවිත කිරීම වඩාත් සුදුසුයි
            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            // පින්තූරය කියවීමේදී ඇතිවන දෝෂ
            throw new RuntimeException("Could not read file: " + e.getMessage());
        } catch (Exception e) {
            // Cloudinary සම්බන්ධතාවයේ හෝ වෙනත් දෝෂ
            throw new RuntimeException("Image upload to Cloudinary failed: " + e.getMessage());
        }
    }
}
