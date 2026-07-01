package com.medsolution.admin

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.medsolution.admin.data.api.ApiClient
import com.medsolution.admin.util.SessionManager

class MedSolutionApp : Application() {

    lateinit var sessionManager: SessionManager
        private set
    lateinit var apiClient: ApiClient
        private set

    override fun onCreate() {
        super.onCreate()
        instance = this
        sessionManager = SessionManager(this)
        apiClient = ApiClient(sessionManager)
        createNotificationChannel()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                getString(R.string.channel_notifications),
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = getString(R.string.channel_description)
                enableVibration(true)
            }
            val nm = getSystemService(NotificationManager::class.java)
            nm.createNotificationChannel(channel)
        }
    }

    companion object {
        lateinit var instance: MedSolutionApp
            private set
        const val CHANNEL_ID = "medsolution_admin_updates"
    }
}
