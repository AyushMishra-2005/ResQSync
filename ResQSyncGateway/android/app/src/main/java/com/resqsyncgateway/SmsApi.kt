package com.resqsyncgateway

import android.util.Log
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

object SmsApi {

    private val client = OkHttpClient()

    fun sendSms(
        sender: String,
        message: String
    ) {

        Thread {

            try {

                val json = JSONObject().apply {
                    put("sender", sender)
                    put("message", message)
                }

                val requestBody =
                    json.toString()
                        .toRequestBody(
                            "application/json"
                                .toMediaType()
                        )

                val request =
                    Request.Builder()
                        .url(
                            "http://10.93.15.41:8000/api/sms"
                        )
                        .post(requestBody)
                        .build()

                client.newCall(request)
                    .execute()
                    .use { response ->

                        Log.d(
                            "ResQSync",
                            "Backend Response: ${response.code}"
                        )

                    }

            } catch (e: Exception) {

                Log.e(
                    "ResQSync",
                    "Failed to send SMS",
                    e
                )

            }

        }.start()
    }
}