package com.example.nsu_ovijog_app.api;

public interface API {
    void login(String email,String password);
    void complaint(String fEmail,String rEmail,String cmTitle,String cmDetail);
    void gLogin();
}
