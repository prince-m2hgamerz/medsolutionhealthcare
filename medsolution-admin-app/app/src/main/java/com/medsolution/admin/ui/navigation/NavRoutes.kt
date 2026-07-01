package com.medsolution.admin.ui.navigation

object NavRoutes {
    const val LOGIN = "login"
    const val DASHBOARD = "dashboard"
    const val LEADS = "leads"
    const val LEAD_DETAIL = "lead/{leadId}"
    const val EMAILS = "emails"
    const val EMAIL_DETAIL = "email/{emailId}"
    const val COMPOSE_EMAIL = "compose_email"

    fun leadDetail(leadId: String) = "lead/$leadId"
    fun emailDetail(emailId: Int) = "email/$emailId"
}
