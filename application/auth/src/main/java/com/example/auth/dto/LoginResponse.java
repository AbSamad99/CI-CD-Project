package com.example.auth.dto;

public class LoginResponse extends BaseResponse {
    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
