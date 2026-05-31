package com.resqsyncgateway

import android.content.Context
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

        val prefs =
            reactContext.getSharedPreferences(
                "resqsync",
                Context.MODE_PRIVATE
            )

        prefs.edit()
            .putBoolean(
                "gateway_enabled",
                true
            )
            .apply()

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

        val prefs =
            reactContext.getSharedPreferences(
                "resqsync",
                Context.MODE_PRIVATE
            )

        prefs.edit()
            .putBoolean(
                "gateway_enabled",
                false
            )
            .apply()

        val intent = Intent(
            reactContext,
            ForegroundService::class.java
        )

        reactContext.stopService(intent)
    }
}