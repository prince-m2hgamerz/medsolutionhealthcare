package com.medsolution.admin.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.medsolution.admin.MedSolutionApp
import com.medsolution.admin.data.model.Attachment
import com.medsolution.admin.data.model.Email
import com.medsolution.admin.data.model.EmailWorkerRequest
import com.medsolution.admin.notification.PollingService
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

data class EmailsUiState(
    val isLoading: Boolean = false,
    val emails: List<Email> = emptyList(),
    val selectedEmail: Email? = null,
    val attachments: List<Attachment>? = null,
    val sendSuccess: Boolean = false,
    val deleteSuccess: Boolean = false,
    val error: String? = null
)

class EmailsViewModel(application: Application) : AndroidViewModel(application) {

    private val apiClient = (application as MedSolutionApp).apiClient

    private val _uiState = MutableStateFlow(EmailsUiState())
    val uiState: StateFlow<EmailsUiState> = _uiState

    fun loadEmails() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            val result = withContext(Dispatchers.IO) { apiClient.getEmails() }
            result.onSuccess { response ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    emails = response.emails
                )
            }.onFailure { e ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to load emails"
                )
            }
        }
    }

    fun loadEmailDetail(id: Int) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            val emailResult = withContext(Dispatchers.IO) { apiClient.getEmail(id) }
            emailResult.onSuccess { email ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    selectedEmail = email
                )
                loadAttachments(id)
            }.onFailure { e ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to load email"
                )
            }
        }
    }

    private fun loadAttachments(id: Int) {
        viewModelScope.launch {
            val result = withContext(Dispatchers.IO) { apiClient.getEmailAttachments(id) }
            result.onSuccess { attachments ->
                _uiState.value = _uiState.value.copy(attachments = attachments)
            }
        }
    }

    fun sendEmail(to: String, subject: String, body: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null, sendSuccess = false)
            val request = EmailWorkerRequest(
                to = to,
                subject = subject,
                textBody = body
            )
            val result = withContext(Dispatchers.IO) { apiClient.sendEmail(request) }
            result.onSuccess {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    sendSuccess = true
                )
            }.onFailure { e ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to send email"
                )
            }
        }
    }

    fun deleteEmail(id: Int) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null, deleteSuccess = false)
            val result = withContext(Dispatchers.IO) { apiClient.deleteEmail(id) }
            result.onSuccess {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    deleteSuccess = true
                )
                loadEmails()
            }.onFailure { e ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to delete email"
                )
            }
        }
    }

    fun refreshFromPolling() {
        val newEmails = PollingService.consumeNewEmails()
        if (newEmails.isNotEmpty()) {
            val current = _uiState.value.emails
            _uiState.value = _uiState.value.copy(emails = newEmails + current)
        }
    }

    fun clearEmailDetail() {
        _uiState.value = _uiState.value.copy(selectedEmail = null, attachments = null)
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}
