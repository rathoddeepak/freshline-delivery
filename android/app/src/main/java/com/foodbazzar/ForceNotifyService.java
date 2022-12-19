package com.foodbazzar;

import android.content.Context;
import android.content.Intent;
import android.app.Service;
import android.os.Bundle;
import android.util.Log;
import android.net.Uri;

import android.app.PendingIntent;
import androidx.core.app.NotificationCompat;
import android.app.Notification;
import android.os.Build;

import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.IBinder;
import android.app.ActivityManager;
import android.app.ActivityManager.RunningAppProcessInfo;

import android.media.RingtoneManager;
import android.media.Ringtone;

import java.util.List;

public class ForceNotifyService extends Service
{
    public final int NOTIFICATION_ID = 1241;
    private Ringtone ringtone;
    private Vibrator v;

    @Override
    public IBinder onBind(Intent intent)
    {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId){
        boolean makeNoise = true;
        ActivityManager activityManager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        List<RunningAppProcessInfo> appProcesses = activityManager.getRunningAppProcesses();
        if (appProcesses != null) {
            final String packageName = getPackageName();
            for (RunningAppProcessInfo appProcess : appProcesses) {
              if (appProcess.importance == RunningAppProcessInfo.IMPORTANCE_FOREGROUND && appProcess.processName.equals(packageName)) {
                makeNoise = false;
              }
            } 
        }
        Bundle bundle = intent.getExtras();        
        if(bundle.containsKey("destroy")){
            stopForegroundService();
            return START_NOT_STICKY;
        }
        if(bundle.containsKey("startForeground")){
            String title = bundle.containsKey("notifyTitle") ? bundle.getString("notifyTitle") : "Importing Task";
            String body = bundle.containsKey("notifyBody") ? bundle.getString("notifyBody") : "Press Here For More!";
            PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, 0);
            Notification n;
            if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){                
                n = new NotificationCompat.Builder(this, "1001")
                                            .setSmallIcon(R.mipmap.ic_launcher)
                                            .setContentTitle(title)
                                            .setContentText(body)
                                            .setContentIntent(pendingIntent).build();                
            }else{                                            
                n = new NotificationCompat.Builder(this)
                                            .setSmallIcon(R.mipmap.ic_launcher)
                                            .setContentTitle(title)
                                            .setContentText(body)
                                            .setContentIntent(pendingIntent).build();                
            }
            startForeground(NOTIFICATION_ID, n);
        }        
        if(makeNoise){            
            Uri ringtoneUri = Uri.parse(intent.getExtras().getString("ringtone-uri"));
            v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);                
            ringtone = RingtoneManager.getRingtone(this, ringtoneUri);
            ringtone.setLooping(true);
            ringtone.play();
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {            
                long[] pattern = { 0, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000};
                v.vibrate(pattern , 0);
            } else {            
                v.vibrate(10000);
            }
        }else{
            stopSelf();
        }        
        return START_NOT_STICKY;
    }

    private void stopForegroundService(){
        stopForeground(true);
        stopSelf();
    }

    @Override
    public void onDestroy()
    {
        if(ringtone != null){
            ringtone.stop();            
        }        
        if(v != null){
            v.cancel();
        }
    }
}