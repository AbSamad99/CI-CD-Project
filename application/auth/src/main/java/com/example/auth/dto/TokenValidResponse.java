package com.example.auth.dto;

public class TokenValidResponse extends BaseResponse {
    private boolean valid;

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }
}
