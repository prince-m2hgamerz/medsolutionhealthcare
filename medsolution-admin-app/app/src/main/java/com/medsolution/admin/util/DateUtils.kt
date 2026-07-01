package com.medsolution.admin.util

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

object DateUtils {

    private val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US).apply {
        timeZone = TimeZone.getTimeZone("UTC")
    }

    private val isoFormatWithTZ = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX", Locale.US).apply {
        timeZone = TimeZone.getTimeZone("UTC")
    }

    private val displayFormat = SimpleDateFormat("MMM dd, yyyy h:mm a", Locale.US)

    private val dateOnlyFormat = SimpleDateFormat("MMM dd, yyyy", Locale.US)

    private val timeOnlyFormat = SimpleDateFormat("h:mm a", Locale.US)

    fun format(isoString: String?): String {
        if (isoString.isNullOrBlank()) return ""
        return try {
            val date = parseIso(isoString)
            if (date != null) displayFormat.format(date) else isoString
        } catch (_: Exception) { isoString }
    }

    fun formatDate(isoString: String?): String {
        if (isoString.isNullOrBlank()) return ""
        return try {
            val date = parseIso(isoString)
            if (date != null) dateOnlyFormat.format(date) else isoString
        } catch (_: Exception) { isoString }
    }

    fun formatTime(isoString: String?): String {
        if (isoString.isNullOrBlank()) return ""
        return try {
            val date = parseIso(isoString)
            if (date != null) timeOnlyFormat.format(date) else isoString
        } catch (_: Exception) { isoString }
    }

    fun timeAgo(isoString: String?): String {
        if (isoString.isNullOrBlank()) return ""
        val date = parseIso(isoString) ?: return isoString
        val now = System.currentTimeMillis()
        val diff = now - date.time
        val minutes = diff / 60000
        val hours = minutes / 60
        val days = hours / 24
        return when {
            minutes < 1 -> "Just now"
            minutes < 60 -> "${minutes}m ago"
            hours < 24 -> "${hours}h ago"
            days < 7 -> "${days}d ago"
            else -> format(isoString)
        }
    }

    private fun parseIso(iso: String): Date? {
        return try {
            if (iso.contains("T") && iso.contains("Z")) {
                val clean = iso.replace("Z", "+00:00")
                isoFormatWithTZ.parse(clean)
            } else if (iso.contains("T") && iso.contains("+")) {
                isoFormatWithTZ.parse(iso)
            } else {
                isoFormat.parse(iso.take(19))
            }
        } catch (_: Exception) { null }
    }
}
