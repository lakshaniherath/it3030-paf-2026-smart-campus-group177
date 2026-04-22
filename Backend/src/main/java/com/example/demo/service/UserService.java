package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
<<<<<<< HEAD
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Date;
=======
import org.springframework.stereotype.Service;
import java.util.Optional;
>>>>>>> member-01

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

<<<<<<< HEAD
    @Autowired
    private PasswordEncoder passwordEncoder;

=======
>>>>>>> member-01
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

<<<<<<< HEAD
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

=======
>>>>>>> member-01
    public void updateUserRole(String email, String role) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setRole(role);
            userRepository.save(user);
        });
    }
<<<<<<< HEAD

    public void deleteUser(String email) throws Exception {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            userRepository.delete(user.get());
        } else {
            throw new Exception("User not found");
        }
    }

    public User registerUser(String name, String email, String password) throws Exception {
        // Check if user already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new Exception("User with this email already exists");
        }

        // Create new user
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setProvider("local");
        user.setRole("STUDENT"); // Default role for new users
        user.setCreatedAt(new Date());

        return userRepository.save(user);
    }

    public boolean updatePasswordByEmail(String email, String rawPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            return false;
        }

        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(rawPassword));
        userRepository.save(user);
        return true;
    }
=======
>>>>>>> member-01
}