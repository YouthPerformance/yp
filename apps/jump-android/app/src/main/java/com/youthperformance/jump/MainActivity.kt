package com.youthperformance.jump

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.youthperformance.jump.data.JumpUser
import com.youthperformance.jump.navigation.YPJumpNavigation
import com.youthperformance.jump.ui.screens.AuthScreen
import com.youthperformance.jump.ui.screens.OnboardingScreen
import com.youthperformance.jump.ui.theme.YPJumpTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            YPJumpTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    var isAuthenticated by remember { mutableStateOf(false) }
                    var hasCompletedOnboarding by remember { mutableStateOf(false) }
                    var currentUser by remember { mutableStateOf<JumpUser?>(null) }

                    when {
                        !isAuthenticated -> {
                            AuthScreen(
                                onAuthSuccess = { isAuthenticated = true }
                            )
                        }
                        !hasCompletedOnboarding -> {
                            OnboardingScreen(
                                onComplete = { user ->
                                    currentUser = user
                                    hasCompletedOnboarding = true
                                }
                            )
                        }
                        else -> {
                            YPJumpNavigation(
                                currentUser = currentUser ?: JumpUser.mock()
                            )
                        }
                    }
                }
            }
        }
    }
}
