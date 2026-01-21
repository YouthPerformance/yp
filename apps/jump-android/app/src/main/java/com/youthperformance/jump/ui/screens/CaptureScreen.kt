package com.youthperformance.jump.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.youthperformance.jump.data.Jump
import com.youthperformance.jump.ui.theme.YPJumpTheme
import kotlinx.coroutines.delay
import java.util.*
import kotlin.random.Random

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CaptureScreen() {
    var isRecording by remember { mutableStateOf(false) }
    var countdown by remember { mutableIntStateOf(0) }
    var showResult by remember { mutableStateOf(false) }
    var mockResult by remember { mutableStateOf<Jump?>(null) }

    // Countdown effect
    LaunchedEffect(countdown) {
        if (countdown > 0) {
            delay(1000)
            countdown--
            if (countdown == 0) {
                isRecording = true
                // Simulate 3-second recording
                delay(3000)
                isRecording = false
                mockResult = createMockJump()
                showResult = true
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Capture Jump") }
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Camera preview placeholder
            CameraPreview()

            // Guidance overlay
            if (!isRecording && countdown == 0) {
                GuidanceOverlay()
            }

            // Countdown display
            if (countdown > 0) {
                CountdownOverlay(countdown = countdown)
            }

            // Recording indicator
            if (isRecording) {
                RecordingIndicator(
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .padding(top = 16.dp)
                )
            }

            // Capture controls
            CaptureControls(
                isRecording = isRecording,
                countdown = countdown,
                onCaptureClick = {
                    if (!isRecording && countdown == 0) {
                        countdown = 3
                    }
                },
                modifier = Modifier.align(Alignment.BottomCenter)
            )
        }
    }

    // Result dialog
    if (showResult && mockResult != null) {
        ResultDialog(
            jump = mockResult!!,
            onDismiss = {
                showResult = false
                mockResult = null
            }
        )
    }
}

@Composable
fun CameraPreview() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        Color.Black.copy(alpha = 0.8f),
                        Color.Black.copy(alpha = 0.6f)
                    )
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Icon(
                imageVector = Icons.Default.CameraAlt,
                contentDescription = null,
                tint = Color.White.copy(alpha = 0.5f),
                modifier = Modifier.size(60.dp)
            )
            Text(
                text = "Camera Preview",
                style = MaterialTheme.typography.titleMedium,
                color = Color.White.copy(alpha = 0.5f)
            )
            Surface(
                shape = RoundedCornerShape(8.dp),
                color = Color.Green.copy(alpha = 0.3f)
            ) {
                Text(
                    text = "120 FPS",
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                    style = MaterialTheme.typography.labelMedium,
                    color = Color.Green
                )
            }
        }
    }
}

@Composable
fun GuidanceOverlay() {
    Box(modifier = Modifier.fillMaxSize()) {
        // Top guidance chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            GuidanceChip(
                icon = Icons.Default.Person,
                text = "Full body visible",
                isValid = true
            )
            GuidanceChip(
                icon = Icons.Default.WbSunny,
                text = "Good lighting",
                isValid = true
            )
        }

        // Body frame guide
        Box(
            modifier = Modifier
                .align(Alignment.Center)
                .width(200.dp)
                .height(400.dp)
                .border(
                    width = 2.dp,
                    color = Color.White.copy(alpha = 0.5f),
                    shape = RoundedCornerShape(20.dp)
                ),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "Position yourself",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.White
                )
                Text(
                    text = "inside the frame",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.White
                )
            }
        }

        // Bottom tips
        Row(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 140.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.Info,
                contentDescription = null,
                tint = Color.White.copy(alpha = 0.7f),
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = "Stand 6-10 feet from camera",
                style = MaterialTheme.typography.bodySmall,
                color = Color.White.copy(alpha = 0.7f)
            )
        }
    }
}

@Composable
fun GuidanceChip(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    text: String,
    isValid: Boolean
) {
    Surface(
        shape = RoundedCornerShape(20.dp),
        color = Color.Black.copy(alpha = 0.5f)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = if (isValid) Icons.Default.CheckCircle else icon,
                contentDescription = null,
                tint = if (isValid) Color.Green else Color.White,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = text,
                style = MaterialTheme.typography.labelSmall,
                color = Color.White
            )
        }
    }
}

@Composable
fun CountdownOverlay(countdown: Int) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = countdown.toString(),
            fontSize = 120.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )
    }
}

@Composable
fun RecordingIndicator(modifier: Modifier = Modifier) {
    val infiniteTransition = rememberInfiniteTransition(label = "recording")
    val alpha by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 0.3f,
        animationSpec = infiniteRepeatable(
            animation = tween(500),
            repeatMode = RepeatMode.Reverse
        ),
        label = "recording_alpha"
    )

    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(25.dp),
        color = Color.Black.copy(alpha = 0.7f)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 20.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(12.dp)
                    .clip(CircleShape)
                    .background(Color.Red.copy(alpha = alpha))
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "Recording...",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                color = Color.White
            )
        }
    }
}

@Composable
fun CaptureControls(
    isRecording: Boolean,
    countdown: Int,
    onCaptureClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.padding(bottom = 40.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Capture button
        Button(
            onClick = onCaptureClick,
            modifier = Modifier.size(80.dp),
            shape = CircleShape,
            colors = ButtonDefaults.buttonColors(
                containerColor = if (isRecording) Color.Red else MaterialTheme.colorScheme.primary
            ),
            enabled = countdown == 0
        ) {
            if (isRecording) {
                Box(
                    modifier = Modifier
                        .size(30.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color.White)
                )
            } else {
                Icon(
                    imageVector = Icons.Default.SportsGymnastics,
                    contentDescription = "Capture",
                    modifier = Modifier.size(32.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = when {
                isRecording -> "Recording..."
                countdown > 0 -> "Get ready!"
                else -> "Tap to start 3-second countdown"
            },
            style = MaterialTheme.typography.bodySmall,
            color = Color.White.copy(alpha = 0.7f)
        )
    }
}

@Composable
fun ResultDialog(jump: Jump, onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = "🎉 Jump Result",
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
        },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = String.format("%.1f\"", jump.heightInches),
                    style = MaterialTheme.typography.displayLarge,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = String.format("%.1f cm", jump.heightCm),
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(16.dp))
                VerificationBadge(tier = jump.verificationTier)
            }
        },
        confirmButton = {
            Button(onClick = onDismiss) {
                Text("Done")
            }
        },
        dismissButton = {
            OutlinedButton(onClick = { /* Share */ }) {
                Text("Share")
            }
        }
    )
}

private fun createMockJump(): Jump {
    return Jump(
        id = UUID.randomUUID().toString(),
        userId = "user_123",
        heightInches = Random.nextDouble(28.0, 35.0),
        heightCm = Random.nextDouble(71.0, 89.0),
        confidence = Jump.Confidence.HIGH,
        verificationTier = Jump.VerificationTier.SILVER,
        videoStorageId = "video_new",
        verificationPayload = null,
        isPractice = false,
        status = Jump.JumpStatus.COMPLETE,
        gpsCity = "Houston",
        gpsState = "TX",
        gpsCountry = "US",
        createdAt = Date()
    )
}

@Preview(showBackground = true)
@Composable
fun CaptureScreenPreview() {
    YPJumpTheme {
        CaptureScreen()
    }
}
