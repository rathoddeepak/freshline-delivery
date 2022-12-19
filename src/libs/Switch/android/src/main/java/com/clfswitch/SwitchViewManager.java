package com.clfswitch;

import android.content.Context;
import android.graphics.Color;

import com.jtv7.rippleswitchlib.RippleSwitch;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.common.MapBuilder;
/**
 * React Native ViewManager corresponding to RippleSwitch
 */

import java.util.Map;

public class SwitchViewManager extends SimpleViewManager<RippleSwitch> {

    private RippleSwitch mRippleSwitch;
    
    @Override
    public String getName() {
        return "BubbleSwitch";
    }

    @Override
    protected RippleSwitch createViewInstance(final ThemedReactContext reactContext) {
        mRippleSwitch = new RippleSwitch(reactContext);
        mRippleSwitch.setOnCheckedChangeListener(new RippleSwitch.OnCheckedChangeListener() {
            @Override
            public void onCheckChanged(boolean checked) {
                WritableMap event = Arguments.createMap();
                event.putBoolean("checked", checked);
                ((ReactContext) reactContext).getJSModule(RCTEventEmitter.class).receiveEvent(mRippleSwitch.getId(), "onChecked", event);
            }
        });
        return mRippleSwitch;
    }    
    
    @ReactProp(name = "checked", defaultBoolean = false)
    public void setChecked(RippleSwitch view, boolean checked) {
        view.setChecked(checked);
    }

    @ReactProp(name = "activeColor")
    public void setCheckedColor(RippleSwitch view, String color) {
        view.setCheckedColor(Color.parseColor(color));
    }

    @ReactProp(name = "inactiveColor")
    public void setUncheckedColor(RippleSwitch view, String color) {
        view.setUncheckedColor(Color.parseColor(color));
    }


    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder().put("onChecked",MapBuilder.of("registrationName", "onChecked")).build();
    }

}
