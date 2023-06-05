package com.example.nsu_ovijog_app;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import com.google.android.material.button.MaterialButton;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class LodgingComplaint extends AppCompatActivity {

    private static final int REQUEST_CODE_SPEECH_INPUT = 1;
    private static final int IMAGE_REQ = 1;
    private Uri imagePath;
    Map config = new HashMap();
    EditText cDetail;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lodging_complaint);
        EditText emailFaulty = (EditText) findViewById(R.id.faulty);
        EditText emailReviewer = (EditText) findViewById(R.id.reviewer);
        EditText cTitle = (EditText) findViewById(R.id.ctitle);
        cDetail= (EditText) findViewById(R.id.complaint);

        MaterialButton submitBtn = (MaterialButton) findViewById(R.id.submitbtn);
        MaterialButton fileBtn = (MaterialButton) findViewById(R.id.filebtn);
        MaterialButton englangBtn = (MaterialButton) findViewById(R.id.engbtn);
        ImageButton voiceBtn = (ImageButton) findViewById(R.id.vbtn);



        fileBtn.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
               // requestPermission();
              //  Toast.makeText(LodgingComplaint.this, imagePath.toString(), Toast.LENGTH_SHORT).show();
            }


        });


        submitBtn.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {

                String emailFault = emailFaulty.getText().toString();
                String emailReview = emailReviewer.getText().toString();
                String cTitleText = cTitle.getText().toString();
                String cDetailText = cDetail.getText().toString();

               // Toast.makeText(LodgingComplaint.this, emailFault, Toast.LENGTH_SHORT).show();
                Model model = Model.getInstance(LodgingComplaint.this.getApplication());
                model.comp(emailFault,emailReview,cTitleText,cDetailText);

            }


        });

        voiceBtn.setOnClickListener(
                new View.OnClickListener() {

                    @Override
                    public void onClick(View v) {
                        speak();

                    }
                }
        );


        englangBtn.setOnClickListener(
                new View.OnClickListener() {

                    @Override
                    public void onClick(View v) {
                        speaken();

                    }
                }
        );

    }


    private void requestPermission() {
        if(ContextCompat.checkSelfPermission(LodgingComplaint.this, Manifest.permission.READ_EXTERNAL_STORAGE)
                == PackageManager.PERMISSION_GRANTED)
        {
            selectImage();
        }else
        {
            ActivityCompat.requestPermissions(LodgingComplaint.this,new String[]{
                    Manifest.permission.READ_EXTERNAL_STORAGE
            },IMAGE_REQ);
        }

    }

    private void selectImage() {
        Intent intent=new Intent();
        intent.setType("image/*");// images for now
        intent.setAction(Intent.ACTION_GET_CONTENT);
        someActivityResultLauncher.launch(intent);
    }
    ActivityResultLauncher<Intent> someActivityResultLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            new ActivityResultCallback<ActivityResult>() {
                @Override
                public void onActivityResult(ActivityResult result) {
                    if (result.getResultCode() == Activity.RESULT_OK) {
                        // There are no request codes
                        Intent data = result.getData();
                        imagePath=data.getData();

                    }
                }
            });

    private  void speaken(){
            String languagePref = "en_US"; // english google tts
            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, languagePref);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, languagePref);
            intent.putExtra(RecognizerIntent.EXTRA_ONLY_RETURN_LANGUAGE_PREFERENCE, languagePref);
            intent.putExtra(RecognizerIntent.EXTRA_PROMPT, " English Speech only for Detailed complain");
            try {
                startActivityForResult(intent, REQUEST_CODE_SPEECH_INPUT);
            } catch (Exception e) {


            }


        }
        private void speak () {
            String languagePref = "bn_BD"; // bengali for google cloud tts api
            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, languagePref);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, languagePref);
            intent.putExtra(RecognizerIntent.EXTRA_ONLY_RETURN_LANGUAGE_PREFERENCE, languagePref);
            intent.putExtra(RecognizerIntent.EXTRA_PROMPT, " অভিযোগ করুন আপনার মাতৃভাষায় ");
            try {
                startActivityForResult(intent, REQUEST_CODE_SPEECH_INPUT);
            } catch (Exception e) {


            }


        }

        @Override
        protected void onActivityResult ( int requestCode, int resultCode, @Nullable Intent data){
            super.onActivityResult(requestCode, resultCode, data);
            if (requestCode == REQUEST_CODE_SPEECH_INPUT) {
                if (resultCode == RESULT_OK) {
                    ArrayList<String> result = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
                    cDetail.setText(result.get(0));
                }
            }
        }



}