package com.medsolution.admin.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.medsolution.admin.MedSolutionApp
import com.medsolution.admin.data.model.DashboardData
import com.medsolution.admin.data.model.PipelineCounts
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

data class DashboardUiState(
    val isLoading: Boolean = false,
    val dashboard: DashboardData? = null,
    val pipeline: PipelineCounts? = null,
    val leadsCountToday: Int = 0,
    val emailsCountToday: Int = 0,
    val totalLeads: Int = 0,
    val totalEmails: Int = 0,
    val error: String? = null
)

class DashboardViewModel(application: Application) : AndroidViewModel(application) {

    private val apiClient = (application as MedSolutionApp).apiClient

    private val _uiState = MutableStateFlow(DashboardUiState())
    val uiState: StateFlow<DashboardUiState> = _uiState

    fun loadDashboard() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            val result = withContext(Dispatchers.IO) { apiClient.getDashboard() }
            result.onSuccess { data ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    dashboard = data,
                    pipeline = data.pipelineCounts,
                    leadsCountToday = data.newLeadsToday,
                    emailsCountToday = data.newEmailsToday,
                    totalLeads = data.totalLeads,
                    totalEmails = data.totalEmails
                )
            }.onFailure { e ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to load dashboard"
                )
            }
        }
    }
}
