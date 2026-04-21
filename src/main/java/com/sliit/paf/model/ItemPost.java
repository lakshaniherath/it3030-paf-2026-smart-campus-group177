package com.sliit.paf.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "item_posts")
public class ItemPost {
    @Id
    private String id;
    private String name;
    private String description;
    private List<String> imagePaths; // පින්තූර 3 පාරවල් (Paths) මෙතන සේව් වෙනවා

    // Getters and Setters (මේවා ඕනේ properties access කරන්න)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getImagePaths() { return imagePaths; }
    public void setImagePaths(List<String> imagePaths) { this.imagePaths = imagePaths; }
}
