package com.medsolution.admin.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.medsolution.admin.data.model.Email
import com.medsolution.admin.ui.theme.Gold
import com.medsolution.admin.ui.viewmodel.EmailsViewModel
import com.medsolution.admin.util.DateUtils

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EmailsListScreen(
    onEmailClick: (Int) -> Unit,
    onComposeEmail: () -> Unit,
    viewModel: EmailsViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadEmails()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Emails", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = Color.White
                ),
                actions = {
                    TextButton(onClick = onComposeEmail) {
                        Text("Compose", color = Gold)
                    }
                }
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            when {
                uiState.isLoading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center),
                        color = MaterialTheme.colorScheme.primary
                    )
                }
                uiState.emails.isEmpty() -> {
                    Text(
                        text = "No emails yet",
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                else -> {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(12.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(uiState.emails, key = { it.id }) { email ->
                            EmailCard(
                                email = email,
                                onClick = { onEmailClick(email.id) }
                            )
                        }
                    }
                }
            }

            uiState.error?.let { error ->
                Snackbar(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(16.dp),
                    action = {
                        TextButton(onClick = viewModel::clearError) {
                            Text("Dismiss")
                        }
                    }
                ) {
                    Text(error)
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EmailDetailScreen(
    emailId: Int,
    onBack: () -> Unit,
    viewModel: EmailsViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var showDeleteConfirm by remember { mutableStateOf(false) }

    LaunchedEffect(emailId) {
        viewModel.loadEmailDetail(emailId)
    }

    if (showDeleteConfirm) {
        AlertDialog(
            onDismissRequest = { showDeleteConfirm = false },
            title = { Text("Delete Email") },
            text = { Text("Are you sure you want to delete this email?") },
            confirmButton = {
                TextButton(onClick = {
                    showDeleteConfirm = false
                    viewModel.deleteEmail(emailId)
                }) {
                    Text("Delete", color = MaterialTheme.colorScheme.error)
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteConfirm = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Email Detail", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = Color.White,
                    navigationIconContentColor = Color.White
                ),
                navigationIcon = {
                    TextButton(onClick = {
                        viewModel.clearEmailDetail()
                        onBack()
                    }) { Text("Back", color = Gold) }
                },
                actions = {
                    TextButton(onClick = { showDeleteConfirm = true }) {
                        Text("Delete", color = Gold)
                    }
                }
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            when {
                uiState.isLoading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center),
                        color = MaterialTheme.colorScheme.primary
                    )
                }
                uiState.selectedEmail != null -> {
                    val email = uiState.selectedEmail!!
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(
                                    text = email.subject ?: "(No Subject)",
                                    style = MaterialTheme.typography.titleLarge.copy(
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                )
                                Spacer(modifier = Modifier.height(12.dp))
                                Text(
                                    text = "From",
                                    style = MaterialTheme.typography.labelMedium,
                                    color = Color(0xFF78909C)
                                )
                                Text(
                                    buildString {
                                        if (email.from_name != null) append(email.from_name).append(" ")
                                        append("<${email.from_address}>")
                                    },
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = Color(0xFF37474F)
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "To",
                                    style = MaterialTheme.typography.labelMedium,
                                    color = Color(0xFF78909C)
                                )
                                Text(
                                    email.to_address.ifEmpty { "N/A" },
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = Color(0xFF37474F)
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    DateUtils.format(email.created_at),
                                    style = MaterialTheme.typography.labelSmall,
                                    color = Color(0xFF90A4AE)
                                )
                            }
                        }

                        HorizontalDivider(color = Color(0xFFECEFF1))

                        Text(
                            text = email.text_body ?: "(No content)",
                            style = MaterialTheme.typography.bodyMedium,
                            color = Color(0xFF37474F)
                        )

                        uiState.attachments?.let { attachments ->
                            if (attachments.isNotEmpty()) {
                                Card(
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(12.dp),
                                    colors = CardDefaults.cardColors(
                                        containerColor = Color(0xFFF5F5F5)
                                    )
                                ) {
                                    Column(modifier = Modifier.padding(12.dp)) {
                                        Text(
                                            "Attachments (${attachments.size})",
                                            style = MaterialTheme.typography.titleSmall.copy(
                                                fontWeight = FontWeight.Bold
                                            ),
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                        Spacer(modifier = Modifier.height(8.dp))
                                        for (a in attachments) {
                                            Text(
                                                text = a.filename,
                                                style = MaterialTheme.typography.bodySmall,
                                                color = Gold,
                                                fontWeight = FontWeight.Medium
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun EmailCard(email: Email, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = email.from_name ?: email.from_address,
                    style = MaterialTheme.typography.titleSmall.copy(
                        fontWeight = FontWeight.Bold
                    ),
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.weight(1f)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = DateUtils.timeAgo(email.created_at),
                    style = MaterialTheme.typography.labelSmall,
                    color = Color(0xFF90A4AE)
                )
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = email.subject ?: "(No Subject)",
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontWeight = FontWeight.Medium
                ),
                color = Color(0xFF37474F),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            if (!email.text_body.isNullOrBlank()) {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = email.text_body,
                    style = MaterialTheme.typography.bodySmall,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    color = Color(0xFF78909C)
                )
            }
        }
    }
}
