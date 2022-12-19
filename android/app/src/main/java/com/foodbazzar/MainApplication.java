package com.foodbazzar;

import android.media.AudioAttributes;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.media.RingtoneManager;
import android.net.Uri;
import android.content.Intent;

import android.app.Application;
import android.content.Context;
import androidx.multidex.MultiDex;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.razorpay.rn.RazorpayPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.horcrux.svg.SvgPackage;
import com.reactnativecommunity.art.ARTPackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.mrousavy.blurhash.BlurhashPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import org.reactnative.maskedview.RNCMaskedViewPackage;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import ui.selectionmenu.RNSelectionMenuPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.placepicker.PlacePickerPackage;
import com.cogo.CogoPackage;
import com.clufter.OtpVerify.RNOtpVerifyPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import com.clfswitch.SwitchPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          packages.add(new RNOtpVerifyPackage());
          packages.add(new PlacePickerPackage());
          packages.add(new CogoPackage());
          packages.add(new SwitchPackage());
          packages.add(new RNSelectionMenuPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

    if (android.os.Build.VERSION. SDK_INT >= android.os.Build.VERSION_CODES.O) {
      String NOTIFICATION_CHANNEL_ID = "1001";      
      NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
      NotificationChannel notificationChannel = new NotificationChannel(NOTIFICATION_CHANNEL_ID , "Tasks" , NotificationManager.IMPORTANCE_HIGH);       
      assert mNotificationManager != null;
      mNotificationManager.createNotificationChannel(notificationChannel) ;
    }
  }

  //to run multi dex
  @Override
  protected void attachBaseContext(Context base) {
      super.attachBaseContext(base);
      MultiDex.install(this);
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.foodbazzar.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
