package com.resqsyncgateway

import android.content.Intent
import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ForegroundModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ForegroundModule"
    }

    @ReactMethod
    fun startService() {

        val intent = Intent(
            reactContext,
            ForegroundService::class.java
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(intent)
        } else {
            reactContext.startService(intent)
        }
    }

    @ReactMethod
    fun stopService() {

        val intent = Intent(
            reactContext,
            ForegroundService::class.java
        )

        reactContext.stopService(intent)
    }
}