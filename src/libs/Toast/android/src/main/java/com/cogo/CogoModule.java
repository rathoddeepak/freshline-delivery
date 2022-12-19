package com.cogo;

import android.util.Log;
import android.os.Vibrator;
import android.content.Intent;
import android.content.Context;
import android.app.ActivityManager;
import android.app.NotificationManager;
import android.app.ActivityManager.RunningServiceInfo;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.shashank.sony.fancytoastlib.FancyToast;

@ReactModule(name = CogoModule.NAME)
public final class CogoModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;    
    public static final String NAME = "CogoToast";    
    public CogoModule(ReactApplicationContext reactContext) {
     super(reactContext);
     this.reactContext = reactContext;     
    }

    @Override
    public String getName() {
     return NAME;
    }
    
    @ReactMethod
    public void success(String s){
      FancyToast.makeText(reactContext,s,FancyToast.LENGTH_LONG,FancyToast.SUCCESS,false).show();      
    }

    @ReactMethod
    public void warn(String s){
      FancyToast.makeText(reactContext,s,FancyToast.LENGTH_LONG,FancyToast.WARNING,false).show();
    }

    @ReactMethod
    public void error(String s){
      FancyToast.makeText(reactContext,s,FancyToast.LENGTH_LONG,FancyToast.ERROR,false).show();
    }

    @ReactMethod
    public void defaultT(String s){
      FancyToast.makeText(reactContext,s,FancyToast.LENGTH_LONG,FancyToast.DEFAULT,false).show();
    }

    @ReactMethod
    public void confused(String s){
      FancyToast.makeText(reactContext,s,FancyToast.LENGTH_LONG,FancyToast.CONFUSING,false).show();
    }    

    @ReactMethod
    public void removeNotification(){
      NotificationManager notificationManager = (NotificationManager) getReactApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
      notificationManager.cancelAll();
    }
}