package com.medsolution.admin

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.ContextCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.medsolution.admin.notification.PollingService
import com.medsolution.admin.ui.components.BottomNavBar
import com.medsolution.admin.ui.navigation.NavRoutes
import com.medsolution.admin.ui.screens.*
import com.medsolution.admin.ui.theme.MedSolutionAdminTheme
import com.medsolution.admin.ui.viewmodel.AuthViewModel
import com.medsolution.admin.ui.viewmodel.EmailsViewModel
import com.medsolution.admin.ui.viewmodel.LeadsViewModel

class MainActivity : ComponentActivity() {

    private val notificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        requestNotificationPermission()

        setContent {
            MedSolutionAdminTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AppContent()
                }
            }
        }
    }

    private fun requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(
                    this, Manifest.permission.POST_NOTIFICATIONS
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
    }
}

@Composable
fun AppContent() {
    val navController = rememberNavController()
    val authViewModel: AuthViewModel = viewModel()
    val context = LocalContext.current
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val showBottomBar = currentRoute in listOf(
        NavRoutes.DASHBOARD,
        NavRoutes.LEADS,
        NavRoutes.EMAILS
    )

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                BottomNavBar(
                    currentRoute = currentRoute,
                    onTabSelected = { route ->
                        navController.navigate(route) {
                            popUpTo(NavRoutes.DASHBOARD) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = NavRoutes.LOGIN,
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            composable(NavRoutes.LOGIN) {
                LoginScreen(
                    onLoginSuccess = {
                        context.startForegroundService(Intent(context, PollingService::class.java))
                        navController.navigate(NavRoutes.DASHBOARD) {
                            popUpTo(NavRoutes.LOGIN) { inclusive = true }
                        }
                    },
                    viewModel = authViewModel
                )
            }

            composable(NavRoutes.DASHBOARD) {
                DashboardScreen(
                    onLogout = {
                        authViewModel.logout()
                        context.stopService(Intent(context, PollingService::class.java))
                        navController.navigate(NavRoutes.LOGIN) {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                )
            }

            composable(NavRoutes.LEADS) {
                val parentEntry = remember(it) {
                    navController.getBackStackEntry(NavRoutes.DASHBOARD)
                }
                val leadsViewModel: LeadsViewModel = viewModel(parentEntry)
                LeadsListScreen(
                    onLeadClick = { leadId ->
                        navController.navigate(NavRoutes.leadDetail(leadId))
                    },
                    viewModel = leadsViewModel
                )
            }

            composable(
                route = NavRoutes.LEAD_DETAIL,
                arguments = listOf(navArgument("leadId") { type = NavType.StringType })
            ) { backStackEntry ->
                val leadId = backStackEntry.arguments?.getString("leadId") ?: return@composable
                val parentEntry = remember(backStackEntry) {
                    navController.getBackStackEntry(NavRoutes.DASHBOARD)
                }
                val leadsViewModel: LeadsViewModel = viewModel(parentEntry)
                LeadDetailScreen(
                    leadId = leadId,
                    onBack = { navController.popBackStack() },
                    viewModel = leadsViewModel
                )
            }

            composable(NavRoutes.EMAILS) {
                val parentEntry = remember(it) {
                    navController.getBackStackEntry(NavRoutes.DASHBOARD)
                }
                val emailsViewModel: EmailsViewModel = viewModel(parentEntry)
                EmailsListScreen(
                    onEmailClick = { emailId ->
                        navController.navigate(NavRoutes.emailDetail(emailId))
                    },
                    onComposeEmail = {
                        navController.navigate(NavRoutes.COMPOSE_EMAIL)
                    },
                    viewModel = emailsViewModel
                )
            }

            composable(
                route = NavRoutes.EMAIL_DETAIL,
                arguments = listOf(navArgument("emailId") { type = NavType.IntType })
            ) { backStackEntry ->
                val emailId = backStackEntry.arguments?.getInt("emailId") ?: return@composable
                val parentEntry = remember(backStackEntry) {
                    navController.getBackStackEntry(NavRoutes.DASHBOARD)
                }
                val emailsViewModel: EmailsViewModel = viewModel(parentEntry)
                EmailDetailScreen(
                    emailId = emailId,
                    onBack = { navController.popBackStack() },
                    viewModel = emailsViewModel
                )
            }

            composable(NavRoutes.COMPOSE_EMAIL) {
                val parentEntry = remember(it) {
                    navController.getBackStackEntry(NavRoutes.DASHBOARD)
                }
                val emailsViewModel: EmailsViewModel = viewModel(parentEntry)
                ComposeEmailScreen(
                    onBack = { navController.popBackStack() },
                    onSent = { navController.popBackStack() },
                    viewModel = emailsViewModel
                )
            }
        }
    }
}
