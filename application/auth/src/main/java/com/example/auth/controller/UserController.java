package com.example.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.auth.dto.BaseResponse;
import com.example.auth.dto.EmailRequest;
import com.example.auth.dto.ResetPasswordRequest;
import com.example.auth.dto.SignupAndLoginRequest;
import com.example.auth.service.UserService;

@RestController
@RequestMapping("/auth")
public class UserController {
    @Autowired
    private UserService userService;

    // Signup endpoint
    @PostMapping("/signup")
    public ResponseEntity<BaseResponse> signup(@RequestBody SignupAndLoginRequest signupRequest) {
        BaseResponse response = userService.signup(signupRequest.getEmail(), signupRequest.getPassword());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<BaseResponse> login(@RequestBody SignupAndLoginRequest loginRequest) {
        BaseResponse response = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Generate password reset token endpoint
    @PostMapping("/password-reset-token")
    public ResponseEntity<BaseResponse> generatePasswordResetToken(@RequestBody EmailRequest emailRequest) {
        BaseResponse response = userService.generatePasswordResetToken(emailRequest.getEmail());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Validate password reset token endpoint
    @GetMapping("/validate-token")
    public ResponseEntity<BaseResponse> validatePasswordResetToken(@RequestParam String token) {
        BaseResponse response = userService.validatePasswordResetToken(token);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Reset password endpoint
    @PostMapping("/reset-password")
    public ResponseEntity<BaseResponse> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        BaseResponse response = userService.resetPassword(
                resetPasswordRequest.getEmail(),
                resetPasswordRequest.getToken(),
                resetPasswordRequest.getNewPassword());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
