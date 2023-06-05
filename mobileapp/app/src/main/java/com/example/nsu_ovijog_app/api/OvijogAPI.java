package com.example.nsu_ovijog_app.api;
import android.app.Application;
import android.content.Intent;
import android.widget.Toast;

import com.android.volley.*;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.nsu_ovijog_app.LodgingComplaint;
import com.example.nsu_ovijog_app.SuccessfulComplain;
import com.example.nsu_ovijog_app.User;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class OvijogAPI implements API {
    public static final String BASE_URL = "http://10.0.2.2:3000/";
    private RequestQueue mRequestQueue;
    private User loggedInUser;
    private String cUmail;
    private final Application mApplication;
    public  OvijogAPI(Application application){
        mApplication = application;
        mRequestQueue= Volley.newRequestQueue(application);
    }
        @Override
    public void login(String email, String password) {
        String url = BASE_URL + "api/v1/login/loginmobile";
        cUmail=email;
        JSONObject jsonObject = new JSONObject();
        JSONObject user = new JSONObject();
        String body;

            try {
                jsonObject.put("email",email);
                jsonObject.put("password",password);
                user.put("user",jsonObject);
                Response.Listener<JSONObject> successListener = new  Response.Listener<JSONObject>(){
                    @Override
                    public void onResponse(JSONObject response){
                        try {
                            User resUser = User.getUser(response);
                            loggedInUser=resUser;// setting currently logged in user
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        Toast.makeText(mApplication, "Successfully Logged In", Toast.LENGTH_SHORT).show();
                        mApplication.startActivity(new Intent(mApplication.getApplicationContext(), LodgingComplaint.class));
                    }
                };

                Response.ErrorListener errorListener =   new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO: Handle error
                        Toast.makeText(mApplication, "Unsuccessful Login With NSU Ovijog", Toast.LENGTH_SHORT).show();


                    }
                };

                JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST,url,user,successListener,errorListener);
                mRequestQueue.add(request);
            } catch (JSONException e) {
                Toast.makeText(mApplication, "JSON Shomossha", Toast.LENGTH_SHORT).show();

            }
  }
  @Override
    public void complaint(String fEmail,String rEmail,String cmTitle,String cmDetail){
     // Toast.makeText(mApplication, loggedInUser.getToken(), Toast.LENGTH_SHORT).show();
      String url = BASE_URL + "api/v1/complain/createComplainMobile";
      JSONObject Complain = new JSONObject();
      JSONObject jsonBody = new JSONObject();
      try {
          Complain.put("complainer",cUmail);
          Complain.put("faulty",fEmail);
          Complain.put("reviewer",rEmail);
          Complain.put("title",cmTitle);
          Complain.put("complaintext",cmDetail);
          String ev= "NotApplicableNow";
          jsonBody.put("complain",Complain);
          jsonBody.put("evidence",ev);

      } catch (JSONException e) {
          e.printStackTrace();
      }



      JsonObjectRequest jsonCom = new JsonObjectRequest(Request.Method.POST, url, jsonBody, new Response.Listener<JSONObject>() {
          @Override
          public void onResponse(JSONObject response) {

              //checking response
             // Toast.makeText(mApplication, response.toString(), Toast.LENGTH_SHORT).show();

              mApplication.startActivity(new Intent(mApplication.getApplicationContext(), SuccessfulComplain.class));

          }
      }, new Response.ErrorListener() {
          @Override
          public void onErrorResponse(VolleyError error) {

              //errors need to work on this more
              Toast.makeText(mApplication, " Error: Please check Reviewer or Faulty Email", Toast.LENGTH_SHORT).show();
              error.printStackTrace();

          }
      }) {    //adding headers to the request
          @Override
          public Map<String, String> getHeaders() {
              Map<String, String> params = new HashMap<String, String>();
              params.put("authorization", loggedInUser.getToken());
              return params;
          }
      };

      mRequestQueue.add(jsonCom);

  }

    @Override
    public void gLogin() {

    }
}
