package com.medsolution.admin.ui.viewmodel

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.medsolution.admin.MedSolutionApp
import com.medsolution.admin.data.model.Lead
import com.medsolution.admin.notification.PollingService
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

data class LeadsUiState(
    val isLoading: Boolean = false,
    val leads: List<Lead> = emptyList(),
    val selectedLead: Lead? = null,
    val error: String? = null,
    val updateSuccess: Boolean = false
)

class LeadsViewModel(application: Application) : AndroidViewModel(application) {

    private val apiClient = (application as MedSolutionApp).apiClient

    private val _uiState = MutableStateFlow(LeadsUiState())
    val uiState: StateFlow<LeadsUiState> = _uiState

    fun loadLeads() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            val result = withContext(Dispatchers.IO) { apiClient.getLeads() }
            result.onSuccess { response ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    leads = response.leads
                )
            }.onFailure { e ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to load leads"
                )
            }
        }
    }

    fun loadLeadDetail(id: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            val result = withContext(Dispatchers.IO) { apiClient.getLeads() }
            result.onSuccess { response ->
                val lead = response.leads.find { it.id == id }
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    selectedLead = lead
                )
            }.onFailure { e ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to load lead"
                )
            }
        }
    }

    fun updateLeadStatus(id: String, status: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null, updateSuccess = false)
            val result = withContext(Dispatchers.IO) { apiClient.updateLeadStatus(id, status) }
            result.onSuccess {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    updateSuccess = true
                )
                loadLeads()
            }.onFailure { e ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to update lead"
                )
            }
        }
    }

    fun refreshFromPolling() {
        val newLeads = PollingService.consumeNewLeads()
        if (newLeads.isNotEmpty()) {
            val current = _uiState.value.leads
            _uiState.value = _uiState.value.copy(leads = newLeads + current)
        }
    }

    fun clearLeadDetail() {
        _uiState.value = _uiState.value.copy(selectedLead = null)
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}
