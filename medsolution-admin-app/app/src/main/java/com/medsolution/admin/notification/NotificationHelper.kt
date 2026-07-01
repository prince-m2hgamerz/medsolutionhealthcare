package com.medsolution.admin.notification

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.medsolution.admin.MedSolutionApp
import com.medsolution.admin.MainActivity
import com.medsolution.admin.R

object NotificationHelper {

    private var notificationId = 1000

    fun showNewLeadNotification(context: Context, name: String, formType: String) {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("navigate_to", "leads")
        }
        val pendingIntent = PendingIntent.getActivity(
            context, notificationId, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, MedSolutionApp.CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_email)
            .setContentTitle("New Lead: $name")
            .setContentText("$formType - $name")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        try {
            NotificationManagerCompat.from(context).notify(notificationId++, notification)
        } catch (e: SecurityException) {
            Log.w("NotifHelper", "Permission not granted for notifications")
        } catch (e: Exception) {
            Log.e("NotifHelper", "Failed to show notification", e)
        }
    }

    fun showNewEmailNotification(context: Context, subject: String, fromName: String?) {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("navigate_to", "emails")
        }
        val pendingIntent = PendingIntent.getActivity(
            context, notificationId, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val displayName = fromName ?: "Unknown"
        val displaySubject = if (subject.length > 80) subject.take(77) + "..." else subject

        val notification = NotificationCompat.Builder(context, MedSolutionApp.CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("New Email from $displayName")
            .setContentText(displaySubject)
            .setStyle(NotificationCompat.BigTextStyle().bigText(displaySubject))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        try {
            NotificationManagerCompat.from(context).notify(notificationId++, notification)
        } catch (e: SecurityException) {
            Log.w("NotifHelper", "Permission not granted for notifications")
        } catch (e: Exception) {
            Log.e("NotifHelper", "Failed to show notification", e)
        }
    }

    fun dismissAll(context: Context) {
        val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        nm.cancelAll()
    }
}
