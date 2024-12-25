package com.example.auth.service;

import com.example.auth.dto.BaseResponse;
import com.example.auth.dto.LoginResponse;
import com.example.auth.dto.TokenResponse;
import com.example.auth.dto.TokenValidResponse;
import com.example.auth.model.User;
import com.example.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    // Signup a new user
    public BaseResponse signup(String email, String password) {
        // Check if email is already registered
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Email is already in use");
        }

        // Create new user with hashed password
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        // Response
        BaseResponse response = new BaseResponse();
        response.setMessage("User created successfully.");

        return response;
    }

    // Authenticate user login
    public BaseResponse login(String email, String password) {
        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        // Check password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // JWT claims map
        Map<String, Object> jwtMap = new HashMap<>();
        jwtMap.put("id", user.getId());
        jwtMap.put("email", email);
        String jwtToken = jwtService.generateToken(jwtMap);

        // Response
        LoginResponse response = new LoginResponse();
        response.setMessage("User logged in successfully.");
        response.setToken(jwtToken);

        return response;
    }

    // Generate a password reset token
    public BaseResponse generatePasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email not found"));

        String token = UUID.randomUUID().toString();
        user.setPasswordResetToken(token);
        user.setPasswordResetTokenValidity(LocalDateTime.now().plusMinutes(30));

        userRepository.save(user);

        // Response
        TokenResponse response = new TokenResponse();
        response.setMessage("Reset token generated successfully.");
        response.setMessage(token);
        response.setToken(token);

        return response;
    }

    // Validate password reset token
    public BaseResponse validatePasswordResetToken(String token) {
        User user = userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

        boolean valid = user.getPasswordResetTokenValidity().isAfter(LocalDateTime.now());

        // Response
        TokenValidResponse response = new TokenValidResponse();
        response.setMessage(String.format("Token is %s", valid ? "Valid" : "Invalid"));
        response.setValid(valid);

        return response;
    }

    // Reset user password
    public BaseResponse resetPassword(String email, String token, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email not found"));

        if (!token.equals(user.getPasswordResetToken())
                || !(user.getPasswordResetTokenValidity().isAfter(LocalDateTime.now()))) {
            throw new IllegalArgumentException("Invalid or expired token");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenValidity(null);

        userRepository.save(user);

        // Response
        BaseResponse response = new BaseResponse();
        response.setMessage("Password reset successfully.");

        return response;
    }
}
