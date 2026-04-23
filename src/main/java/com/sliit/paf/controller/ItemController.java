package com.sliit.paf.controller;

import com.sliit.paf.model.ItemPost;
import com.sliit.paf.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private MongoTemplate mongoTemplate; // Repository එකක් නැතුව ඉක්මනින් සේව් කරන්න මේක පාවිච්චි කරමු

    @PostMapping("/upload")
    public String uploadItem(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("files") MultipartFile[] files) {

        if (files.length != 3) {
            return "කරුණාකර පින්තූර 3ක්ම තෝරන්න!";
        }

        List<String> fileNames = new ArrayList<>();
        for (MultipartFile file : files) {
            String savedName = fileStorageService.uploadFile(file);
            fileNames.add(savedName);
        }

        // Object එක හදලා Database එකට දානවා
        ItemPost post = new ItemPost();
        post.setName(name);
        post.setDescription(description);
        post.setImagePaths(fileNames);

        mongoTemplate.save(post);

        return " Successfully saved! Now check your MongoDB Dashboard.";
    }
}
