package com.medsolution.admin.data.model

import com.google.gson.annotations.SerializedName

data class LoginRequest(val email: String, val password: String)

data class LoginResponse(
    val success: Boolean,
    val token: String? = null,
    val email: String? = null,
    val message: String? = null,
    val error: String? = null
)

data class Lead(
    val id: String,
    val form_type: String = "",
    val name: String = "",
    val age: Int? = null,
    val gender: String? = null,
    val country: String = "",
    val phone: String = "",
    val email: String? = null,
    val medical_condition: String? = null,
    val doctor_preference: String? = null,
    val insurance_company: String? = null,
    val message: String? = null,
    val file_url: String? = null,
    val status: String = "new",
    val notes: String? = null,
    val assigned_to: String? = null,
    val created_at: String = "",
    val updated_at: String = ""
)

data class LeadsResponse(val leads: List<Lead>)

data class LeadUpdateRequest(val id: String, val status: String)

data class LeadUpdateResponse(val success: Boolean, val message: String? = null, val error: String? = null)

data class DashboardData(
    @SerializedName("total_leads") val totalLeads: Int = 0,
    @SerializedName("total_emails") val totalEmails: Int = 0,
    @SerializedName("new_leads_today") val newLeadsToday: Int = 0,
    @SerializedName("new_emails_today") val newEmailsToday: Int = 0,
    @SerializedName("pipeline_counts") val pipelineCounts: PipelineCounts = PipelineCounts(),
    val pipeline: PipelineCounts = PipelineCounts(),
    @SerializedName("recent_leads") val recentLeads: List<Lead> = emptyList(),
    val counts: FormCounts = FormCounts()
)

data class PipelineCounts(
    val new: Int = 0,
    val contacted: Int = 0,
    val qualified: Int = 0,
    val proposal: Int = 0,
    val negotiation: Int = 0,
    val converted: Int = 0,
    val closed: Int = 0,
    val lost: Int = 0
)

data class FormCounts(
    val doctors: Int = 0,
    val hospitals: Int = 0,
    val treatments: Int = 0
)

data class Email(
    val id: Int = 0,
    val message_id: String? = null,
    val from_name: String? = null,
    val from_address: String = "",
    val to_address: String = "",
    val subject: String? = null,
    val text_body: String? = null,
    val html_body: String? = null,
    val is_read: Int = 0,
    val parent_id: Int? = null,
    val status: String = "inbox",
    val starred: Int = 0,
    val created_at: String = "",
    val attachments: List<Attachment>? = null,
    val thread: List<Email>? = null
)

data class Attachment(
    val id: Int = 0,
    val email_id: Int = 0,
    val filename: String = "",
    val content_type: String? = null,
    val size: Int? = null,
    val url: String = "",
    val created_at: String? = null
)

data class EmailsResponse(
    val emails: List<Email> = emptyList(),
    val nextCursor: String? = null,
    val total: Int = 0
)

data class EmailWorkerRequest(
    val to: String,
    val subject: String,
    @SerializedName("text_body") val textBody: String,
    @SerializedName("html_body") val htmlBody: String? = null,
    val parent_id: Int? = null
)

data class EmailWorkerResponse(
    val success: Boolean,
    val message: String? = null,
    val error: String? = null
)
