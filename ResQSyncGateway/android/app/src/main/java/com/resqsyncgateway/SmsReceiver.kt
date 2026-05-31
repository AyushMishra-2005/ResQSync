package com.resqsyncgateway

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import android.util.Log

class SmsReceiver : BroadcastReceiver() {

    override fun onReceive(
        context: Context,
        intent: Intent
    ) {

        val prefs =
            context.getSharedPreferences(
                "resqsync",
                Context.MODE_PRIVATE
            )

        val gatewayEnabled =
            prefs.getBoolean(
                "gateway_enabled",
                false
            )

        if (!gatewayEnabled) {
            return
        }

        if (
            Telephony.Sms.Intents.SMS_RECEIVED_ACTION ==
            intent.action
        ) {

            for (
                smsMessage in
                Telephony.Sms.Intents
                    .getMessagesFromIntent(intent)
            ) {

                val sender =
                    smsMessage.displayOriginatingAddress

                val body =
                    smsMessage.messageBody

                if (
                    body.trim().startsWith(
                        "ResQSync",
                        ignoreCase = true
                    )
                ) {

                    Log.d(
                        "ResQSync",
                        """
                        Mobile Number: $sender
                        Message:
                        $body
                        """.trimIndent()
                    )

                    SmsApi.sendSms(
                        sender,
                        body
                    )
                }
            }
        }
    }
}