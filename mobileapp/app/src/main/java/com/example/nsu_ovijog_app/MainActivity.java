package com.example.nsu_ovijog_app;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import android.os.Bundle;
import java.util.*;

import com.google.android.gms.common.SignInButton;
import com.google.android.material.button.MaterialButton;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        EditText emailField =(EditText) findViewById(R.id.username);
        EditText passwordField =(EditText) findViewById(R.id.password);

        MaterialButton loginBtn = (MaterialButton) findViewById(R.id.loginbtn);



        SignInButton signInButton = findViewById(R.id.sign_in_button);
        signInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

            }

        });
        loginBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                String email = emailField.getText().toString();
                String password = passwordField.getText().toString();
               /* if(emailField.getText().toString().equals("admin") && passwordField.getText().toString().equals("admin")){

                    Toast.makeText(MainActivity.this,"LOGIN SUCCESSFUL",Toast.LENGTH_SHORT).show();
                }else

                    Toast.makeText(MainActivity.this,"LOGIN FAILED !!!",Toast.LENGTH_SHORT).show(); */
                Model model = Model.getInstance(MainActivity.this.getApplication());
                model.login(email,password);
            }
        });
    }
}