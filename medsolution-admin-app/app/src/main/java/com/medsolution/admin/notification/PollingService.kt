package com.medsolution.admin.notification

import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.medsolution.admin.MainActivity
import com.medsolution.admin.MedSolutionApp
import com.medsolution.admin.data.model.Email
import com.medsolution.admin.data.model.Lead
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

class PollingService : Service() {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private var pollingJob: Job? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("PollingService", "Starting polling service")
        val pendingIntent = PendingIntent.getActivity(
            this, 0, Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("MedSolution Admin")
            .setContentText("Monitoring leads and emails...")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()
        startForeground(NOTIFICATION_ID, notification)
        startPolling()
        return START_STICKY
    }

    private fun startPolling() {
        pollingJob?.cancel()
        pollingJob = scope.launch {
            while (isActive) {
                try {
                    pollForUpdates()
                } catch (e: Exception) {
                    Log.e("PollingService", "Polling error", e)
                }
                delay(30_000L)
            }
        }
    }

    private suspend fun pollForUpdates() {
        val app = MedSolutionApp.instance
        val session = app.sessionManager

        if (!session.isLoggedIn) {
            stopSelf()
            return
        }

        coroutineScope {
            val leadsDeferred = async { checkNewLeads(app) }
            val emailsDeferred = async { checkNewEmails(app) }

            leadsDeferred.await()
            emailsDeferred.await()
        }
    }

    private suspend fun checkNewLeads(app: MedSolutionApp) {
        val result = withContext(Dispatchers.IO) {
            app.apiClient.getLeads()
        }
        result.onSuccess { response ->
            val leads = response.leads
            if (leads.isNotEmpty()) {
                val latestCreated = leads.first().created_at
                val lastSeen = app.sessionManager.lastSeenLeadAt
                if (lastSeen == null) {
                    app.sessionManager.lastSeenLeadAt = latestCreated
                } else {
                    val newLeads = leads.filter { it.created_at > lastSeen }
                    if (newLeads.isNotEmpty()) {
                        app.sessionManager.lastSeenLeadAt = latestCreated
                        for (lead in newLeads) {
                            NotificationHelper.showNewLeadNotification(
                                this@PollingService,
                                lead.name,
                                lead.form_type
                            )
                            _newLeads.value = _newLeads.value + lead
                        }
                    }
                }
            }
        }
    }

    private suspend fun checkNewEmails(app: MedSolutionApp) {
        val result = withContext(Dispatchers.IO) {
            app.apiClient.getEmails(limit = 10)
        }
        result.onSuccess { response ->
            val emails = response.emails
            if (emails.isNotEmpty()) {
                val latestCreated = emails.first().created_at
                val lastSeen = app.sessionManager.lastSeenEmailAt
                if (lastSeen == null) {
                    app.sessionManager.lastSeenEmailAt = latestCreated
                } else {
                    val newEmails = emails.filter { it.created_at > lastSeen }
                    if (newEmails.isNotEmpty()) {
                        app.sessionManager.lastSeenEmailAt = latestCreated
                        for (email in newEmails) {
                            NotificationHelper.showNewEmailNotification(
                                this@PollingService,
                                email.subject ?: "(No Subject)",
                                email.from_name ?: email.from_address
                            )
                            _newEmails.value = _newEmails.value + email
                        }
                    }
                }
            }
        }
    }

    override fun onDestroy() {
        pollingJob?.cancel()
        scope.cancel()
        super.onDestroy()
    }

    companion object {
        private const val NOTIFICATION_ID = 1001
        private const val CHANNEL_ID = "medsolution_polling"

        private val _newLeads = MutableStateFlow<List<Lead>>(emptyList())
        val newLeads: StateFlow<List<Lead>> = _newLeads

        private val _newEmails = MutableStateFlow<List<Email>>(emptyList())
        val newEmails: StateFlow<List<Email>> = _newEmails

        fun consumeNewLeads(): List<Lead> {
            val items = _newLeads.value.toList()
            _newLeads.value = emptyList()
            return items
        }

        fun consumeNewEmails(): List<Email> {
            val items = _newEmails.value.toList()
            _newEmails.value = emptyList()
            return items
        }
    }
}
