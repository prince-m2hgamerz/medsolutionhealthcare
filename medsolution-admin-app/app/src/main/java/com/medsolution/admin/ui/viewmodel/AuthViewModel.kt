package com.medsolution.admin.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.medsolution.admin.MedSolutionApp
import com.medsolution.admin.data.api.ApiClient
import com.medsolution.admin.util.SessionManager
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

data class AuthUiState(
    val isLoading: Boolean = false,
    val isLoggedIn: Boolean = false,
    val error: String? = null
)

class AuthViewModel(application: Application) : AndroidViewModel(application) {

    private val app = application as MedSolutionApp
    private val apiClient: ApiClient = app.apiClient
    private val sessionManager: SessionManager = app.sessionManager

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState

    init {
        _uiState.value = AuthUiState(isLoggedIn = sessionManager.isLoggedIn)
    }

    fun login(email: String, password: String) {
        if (email.isBlank() || password.isBlank()) {
            _uiState.value = _uiState.value.copy(error = "Please enter email and password")
            return
        }
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            val result = withContext(Dispatchers.IO) { apiClient.login(email, password) }
            result.onSuccess { response ->
                if (response.success && response.token != null) {
                    sessionManager.sessionToken = response.token
                    sessionManager.adminEmail = response.email ?: email
                    _uiState.value = AuthUiState(isLoggedIn = true)
                } else {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = response.error ?: response.message ?: "Invalid email or password"
                    )
                }
            }.onFailure { e ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "${e::class.simpleName ?: "Unknown"} - Login failed"
                )
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            withContext(Dispatchers.IO) { apiClient.logout() }
            sessionManager.clear()
            _uiState.value = AuthUiState()
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}
