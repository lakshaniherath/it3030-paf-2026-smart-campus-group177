package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
<<<<<<< HEAD
import org.springframework.beans.factory.annotation.Value;
=======
>>>>>>> member-01
import java.io.IOException;

@Component
public class CustomSuccessHandler implements AuthenticationSuccessHandler {

<<<<<<< HEAD
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

=======
>>>>>>> member-01
    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(oauthUser.getAttribute("name"));
<<<<<<< HEAD
            newUser.setProvider("oauth_google");
            newUser.setRole("STUDENT");
=======
>>>>>>> member-01
            return userRepository.save(newUser);
        });

        if (user.getRole() == null) {
<<<<<<< HEAD
            user.setRole("STUDENT");
            userRepository.save(user);
        } else {
            userRepository.save(user);
        }

        response.sendRedirect(frontendUrl + "/oauth2/success");
=======
            response.sendRedirect("/choose-role");
        } else {
            response.sendRedirect("/dashboard");
        }
>>>>>>> member-01
    }
}