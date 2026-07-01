package com.medsolution.admin.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.medsolution.admin.data.model.Lead
import com.medsolution.admin.ui.theme.Gold
import com.medsolution.admin.ui.viewmodel.LeadsViewModel
import com.medsolution.admin.util.DateUtils

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LeadsListScreen(
    onLeadClick: (String) -> Unit,
    viewModel: LeadsViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadLeads()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Leads", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = Color.White
                )
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
                uiState.leads.isEmpty() -> {
                    Text(
                        text = "No leads yet",
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
                        items(uiState.leads, key = { it.id }) { lead ->
                            LeadCard(
                                lead = lead,
                                onClick = { onLeadClick(lead.id) }
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
fun LeadDetailScreen(
    leadId: String,
    onBack: () -> Unit,
    viewModel: LeadsViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(leadId) {
        viewModel.loadLeadDetail(leadId)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Lead Detail", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = Color.White,
                    navigationIconContentColor = Color.White
                ),
                navigationIcon = {
                    TextButton(onClick = {
                        viewModel.clearLeadDetail()
                        onBack()
                    }) { Text("Back", color = Gold) }
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
                uiState.selectedLead != null -> {
                    val lead = uiState.selectedLead!!
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
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = lead.name,
                                        style = MaterialTheme.typography.titleLarge.copy(
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.onSurface
                                        )
                                    )
                                    StatusBadge(lead.status)
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = lead.form_type,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = Color(0xFF78909C)
                                )
                            }
                        }

                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                DetailRow("Email", lead.email ?: "N/A")
                                HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))
                                DetailRow("Phone", lead.phone ?: "N/A")
                                HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))
                                DetailRow("Status", lead.status.replaceFirstChar { it.uppercase() })
                                HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))
                                DetailRow("Created", DateUtils.format(lead.created_at))
                            }
                        }

                        if (!lead.message.isNullOrBlank()) {
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = Color.White),
                                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Text(
                                        "Message",
                                        style = MaterialTheme.typography.labelMedium,
                                        color = MaterialTheme.colorScheme.primary,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text(
                                        lead.message,
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = Color(0xFF37474F)
                                    )
                                }
                            }
                        }

                        if (!lead.notes.isNullOrBlank()) {
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = Color.White),
                                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Text(
                                        "Notes",
                                        style = MaterialTheme.typography.labelMedium,
                                        color = MaterialTheme.colorScheme.primary,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text(
                                        lead.notes,
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = Color(0xFF37474F)
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.weight(1f))

                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(
                                    "Update Status",
                                    style = MaterialTheme.typography.titleSmall.copy(
                                        fontWeight = FontWeight.Bold
                                    ),
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Spacer(modifier = Modifier.height(12.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    StatusButton(
                                        label = "Contacted",
                                        status = "contacted",
                                        currentStatus = lead.status,
                                        onClick = { viewModel.updateLeadStatus(lead.id, "contacted") },
                                        modifier = Modifier.weight(1f)
                                    )
                                    StatusButton(
                                        label = "Qualified",
                                        status = "qualified",
                                        currentStatus = lead.status,
                                        onClick = { viewModel.updateLeadStatus(lead.id, "qualified") },
                                        modifier = Modifier.weight(1f)
                                    )
                                    StatusButton(
                                        label = "Converted",
                                        status = "converted",
                                        currentStatus = lead.status,
                                        onClick = { viewModel.updateLeadStatus(lead.id, "converted") },
                                        modifier = Modifier.weight(1f)
                                    )
                                    StatusButton(
                                        label = "Lost",
                                        status = "lost",
                                        currentStatus = lead.status,
                                        onClick = { viewModel.updateLeadStatus(lead.id, "lost") },
                                        modifier = Modifier.weight(1f)
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

@Composable
private fun LeadCard(lead: Lead, onClick: () -> Unit) {
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
                    text = lead.name,
                    style = MaterialTheme.typography.titleSmall.copy(
                        fontWeight = FontWeight.Bold
                    ),
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.weight(1f)
                )
                Spacer(modifier = Modifier.width(8.dp))
                StatusBadge(lead.status)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = lead.form_type,
                style = MaterialTheme.typography.bodySmall,
                color = Color(0xFF78909C)
            )
            if (!lead.message.isNullOrBlank()) {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = lead.message,
                    style = MaterialTheme.typography.bodySmall,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    color = Color(0xFF546E7A)
                )
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = DateUtils.timeAgo(lead.created_at),
                style = MaterialTheme.typography.labelSmall,
                color = Color(0xFF90A4AE)
            )
        }
    }
}

@Composable
private fun StatusBadge(status: String) {
    val (bgColor, textColor) = when (status) {
        "new" -> Pair(Color(0xFFFFF8E1), MaterialTheme.colorScheme.primary)
        "contacted" -> Pair(Color(0xFFFFF3E0), Color(0xFFE65100))
        "qualified" -> Pair(Color(0xFFE8F5E9), Color(0xFF1B5E20))
        "converted" -> Pair(Color(0xFFF1F8E9), Gold)
        "lost" -> Pair(Color(0xFFFFEBEE), Color(0xFFC62828))
        "proposal" -> Pair(Color(0xFFF3E5F5), Color(0xFF6A1B9A))
        "negotiation" -> Pair(Color(0xFFE0F2F1), Color(0xFF004D40))
        else -> Pair(Color(0xFFF5F5F5), MaterialTheme.colorScheme.primary)
    }
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(bgColor)
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Text(
            text = status.replaceFirstChar { it.uppercase() },
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.SemiBold,
                fontSize = 11.sp
            ),
            color = textColor
        )
    }
}

@Composable
private fun StatusButton(
    label: String,
    status: String,
    currentStatus: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isActive = currentStatus == status
    val bgColor = when (status) {
        "contacted" -> Color(0xFFFFF3E0)
        "qualified" -> Color(0xFFE8F5E9)
        "converted" -> Color(0xFFF1F8E9)
        "lost" -> Color(0xFFFFEBEE)
        else -> Color(0xFFF5F5F5)
    }
    val activeBg = when (status) {
        "contacted" -> Color(0xFFE65100)
        "qualified" -> Color(0xFF1B5E20)
        "converted" -> Gold
        "lost" -> Color(0xFFC62828)
        else -> Gold
    }
    Button(
        onClick = onClick,
        modifier = modifier.height(36.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = if (isActive) activeBg else bgColor,
            contentColor = if (isActive) Color.White else Color(0xFF37474F)
        ),
        shape = RoundedCornerShape(8.dp),
        contentPadding = PaddingValues(horizontal = 6.dp, vertical = 2.dp)
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.SemiBold,
                fontSize = 10.sp
            )
        )
    }
}

@Composable
private fun DetailRow(label: String, value: String) {
    Column {
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium,
            color = Color(0xFF78909C),
            fontWeight = FontWeight.Medium
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = value,
            style = MaterialTheme.typography.bodyLarge,
            color = Color(0xFF37474F)
        )
    }
}
