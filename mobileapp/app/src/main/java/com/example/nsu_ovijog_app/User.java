package com.example.nsu_ovijog_app;

import org.json.JSONException;
import org.json.JSONObject;

public class User {
    public static User getUser(JSONObject jsonObject) throws JSONException
    {

    String token = jsonObject.getString("token");
    User us = new User(token);
    return us;

    }
    private String token;

    public User(String tkn){
        this.token = tkn;
    }
    public String getToken(){
        return this.token; // retrieving authToken
    }
}
