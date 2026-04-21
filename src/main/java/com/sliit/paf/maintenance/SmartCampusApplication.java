package com.sliit.paf.maintenance; // 1. මේක නිවැරදි කළා (දැන් folder එකට සමානයි)

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

// 2. මුළු project එකම scan කරන්න කියලා මෙතනින් කියනවා. 
// එතකොට අර FileStorageService එක හොයාගන්න බැරි error එක නැති වෙනවා.
@SpringBootApplication(scanBasePackages = "com.sliit.paf") 
public class SmartCampusApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCampusApplication.class, args);
    }

    
    }

