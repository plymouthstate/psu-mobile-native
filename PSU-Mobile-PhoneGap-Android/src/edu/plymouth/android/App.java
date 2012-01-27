package edu.plymouth.android;

import android.os.Bundle;
import com.phonegap.*;

public class App extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Set a property to load the splash image before loading the URL
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        
        // Load the URL (page) that starts the app
        // The second parameter is the amount of time that should pass before the URL is actually loaded... effectively the splash screen show time
        super.loadUrl("https://www.dev.plymouth.edu/webapp/mobile", 2000);
    }
}