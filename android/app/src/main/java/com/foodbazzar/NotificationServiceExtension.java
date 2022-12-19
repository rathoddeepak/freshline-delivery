package com.foodbazzar;
  
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.net.Uri;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.Build;

import android.media.RingtoneManager;
import com.onesignal.OSNotification;
import com.onesignal.OSMutableNotification;
import com.onesignal.OSNotificationReceivedEvent;
import com.onesignal.OneSignal.OSRemoteNotificationReceivedHandler;

import android.database.sqlite.SQLiteStatement;
import com.facebook.react.modules.storage.ReactDatabaseSupplier;

import org.json.JSONObject;
import java.lang.System;

@SuppressWarnings("unused")
public class NotificationServiceExtension implements OSRemoteNotificationReceivedHandler {
    
    @Override
    public void remoteNotificationReceived(Context context, OSNotificationReceivedEvent notificationReceivedEvent) {
        ReactDatabaseSupplier reactDB = ReactDatabaseSupplier.getInstance(context);
        OSNotification notification = notificationReceivedEvent.getNotification();
        OSMutableNotification mutableNotification = notification.mutableCopy();                
        notificationReceivedEvent.complete(mutableNotification);
        String ringtoneUri = "android.resource://" + context.getPackageName() + "/" + R.raw.siren;
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
            notificationReceivedEvent.complete(null);
            Intent notificationIntent = new Intent(context, ForceNotifyService.class);   
            context.stopService(notificationIntent);
            notificationIntent.putExtra("ringtone-uri", ringtoneUri);       
            notificationIntent.putExtra("notifyTitle", notification.getTitle());
            notificationIntent.putExtra("notifyBody", notification.getBody());
            notificationIntent.putExtra("startForeground", "true");
            context.startForegroundService(notificationIntent);            
        }else{            
            Intent startIntent = new Intent(context, ForceNotifyService.class);
            context.stopService(startIntent);
            startIntent.putExtra("ringtone-uri", ringtoneUri);
            context.startService(startIntent);
        }

        try {            
            JSONObject data = notification.getAdditionalData();
            saveKeyValuePair(reactDB, "taskId", data.getString("taskId"));
            saveKeyValuePair(reactDB, "created", String.valueOf(System.currentTimeMillis()));
        }catch (Exception e) {
            
        }        
    }

    private void saveKeyValuePair(ReactDatabaseSupplier reactDB, String key, String value) {
        String sql = "INSERT OR REPLACE INTO catalystLocalStorage VALUES (?, ?);";
        SQLiteStatement statement = reactDB.get().compileStatement(sql);
        try {
            reactDB.get().beginTransaction();
            statement.clearBindings();
            statement.bindString(1, key);
            statement.bindString(2, value);
            statement.execute();
            reactDB.get().setTransactionSuccessful();
        } catch (Exception e) {
            Log.w("YOUR_TAG", e.getMessage(), e);
        } finally {
            try {
                reactDB.get().endTransaction();
            } catch (Exception e) {
                Log.w("YOUR_TAG", e.getMessage(), e);
            }
        }
    }
}