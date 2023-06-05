package com.example.nsu_ovijog_app;
import android.app.Application;
import com.example.nsu_ovijog_app.api.API;
import com.example.nsu_ovijog_app.api.OvijogAPI;
public class Model {

    private static Model sInstance = null;
    private final API mApi;

    public static Model getInstance (Application application) {
        if (sInstance==null){
            sInstance = new Model(application);
        }

        return sInstance;
    }
    private final Application mApplication;
    private Model(Application application) {
        mApplication=application;

        mApi  = new OvijogAPI(mApplication);
    }
    public Application getApplication(){
        return mApplication;
    }
    public void login(String email, String password){
        mApi.login(email,password);
    }
    public void comp(String fault,String review,String Title,String Detail){
        mApi.complaint(fault,review,Title,Detail);
    }
    public void glogin(){ mApi.gLogin();}
}
