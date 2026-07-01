package com.medsolution.admin.util

import android.content.Context
import android.content.SharedPreferences

class SessionManager(context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences("admin_session", Context.MODE_PRIVATE)

    var sessionToken: String?
        get() = prefs.getString(KEY_SESSION, null)
        set(value) {
            if (value == null) prefs.edit().remove(KEY_SESSION).apply()
            else prefs.edit().putString(KEY_SESSION, value).apply()
        }

    var adminEmail: String?
        get() = prefs.getString(KEY_EMAIL, null)
        set(value) {
            if (value == null) prefs.edit().remove(KEY_EMAIL).apply()
            else prefs.edit().putString(KEY_EMAIL, value).apply()
        }

    var lastSeenLeadAt: String?
        get() = prefs.getString(KEY_LAST_LEAD, null)
        set(value) {
            if (value == null) prefs.edit().remove(KEY_LAST_LEAD).apply()
            else prefs.edit().putString(KEY_LAST_LEAD, value).apply()
        }

    var lastSeenEmailAt: String?
        get() = prefs.getString(KEY_LAST_EMAIL, null)
        set(value) {
            if (value == null) prefs.edit().remove(KEY_LAST_EMAIL).apply()
            else prefs.edit().putString(KEY_LAST_EMAIL, value).apply()
        }

    val isLoggedIn: Boolean get() = sessionToken != null

    fun clear() {
        prefs.edit().clear().apply()
    }

    companion object {
        private const val KEY_SESSION = "admin_session"
        private const val KEY_EMAIL = "admin_email"
        private const val KEY_LAST_LEAD = "last_seen_lead_at"
        private const val KEY_LAST_EMAIL = "last_seen_email_at"
    }
}
