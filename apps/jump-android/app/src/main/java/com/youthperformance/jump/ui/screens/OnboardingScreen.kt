package com.youthperformance.jump.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.youthperformance.jump.data.JumpUser
import com.youthperformance.jump.ui.theme.YPJumpTheme
import kotlinx.coroutines.delay
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OnboardingScreen(onComplete: (JumpUser) -> Unit) {
    var displayName by remember { mutableStateOf("") }
    var birthYear by remember { mutableIntStateOf(2008) }
    var selectedGender by remember { mutableStateOf(JumpUser.Gender.MALE) }
    var city by remember { mutableStateOf("") }
    var state by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var showAgeError by remember { mutableStateOf(false) }

    val currentYear = Calendar.getInstance().get(Calendar.YEAR)
    val isFormValid = displayName.isNotEmpty() && city.isNotEmpty()
    val age = currentYear - birthYear
    val isAgeValid = age in 13..22

    // Handle form submission
    LaunchedEffect(isLoading) {
        if (isLoading) {
            delay(1000)
            val user = JumpUser(
                id = UUID.randomUUID().toString(),
                displayName = displayName,
                birthYear = birthYear,
                gender = selectedGender,
                city = city,
                state = state.ifEmpty { null },
                country = "US",
                profileVisibility = JumpUser.ProfileVisibility.PUBLIC,
                showOnLeaderboards = true,
                dailyJumpsUsed = 0,
                lastJumpResetAt = Date(),
                createdAt = Date(),
                updatedAt = Date()
            )
            isLoading = false
            onComplete(user)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Create Profile") })
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            // Header
            HeaderSection()

            // Form Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(20.dp)
                ) {
                    // Display Name
                    OutlinedTextField(
                        value = displayName,
                        onValueChange = { displayName = it },
                        label = { Text("Display Name") },
                        placeholder = { Text("Choose a username") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )

                    // Birth Year
                    Column {
                        Text(
                            text = "Birth Year",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(8.dp))

                        // Year selector using dropdown
                        var expanded by remember { mutableStateOf(false) }
                        ExposedDropdownMenuBox(
                            expanded = expanded,
                            onExpandedChange = { expanded = it }
                        ) {
                            OutlinedTextField(
                                value = birthYear.toString(),
                                onValueChange = {},
                                readOnly = true,
                                trailingIcon = {
                                    ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded)
                                },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .menuAnchor(),
                                shape = RoundedCornerShape(12.dp)
                            )
                            ExposedDropdownMenu(
                                expanded = expanded,
                                onDismissRequest = { expanded = false }
                            ) {
                                (currentYear - 22..currentYear - 13).forEach { year ->
                                    DropdownMenuItem(
                                        text = { Text(year.toString()) },
                                        onClick = {
                                            birthYear = year
                                            expanded = false
                                        }
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Your exact age is never shown. Only age range (e.g., 15-16) is displayed.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    // Gender
                    Column {
                        Text(
                            text = "Gender",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        SingleChoiceSegmentedButtonRow(
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            JumpUser.Gender.entries.forEachIndexed { index, gender ->
                                SegmentedButton(
                                    selected = selectedGender == gender,
                                    onClick = { selectedGender = gender },
                                    shape = SegmentedButtonDefaults.itemShape(
                                        index = index,
                                        count = JumpUser.Gender.entries.size
                                    )
                                ) {
                                    Text(gender.name.lowercase().replaceFirstChar { it.uppercase() })
                                }
                            }
                        }
                    }

                    // Location
                    Column {
                        Text(
                            text = "Location",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            OutlinedTextField(
                                value = city,
                                onValueChange = { city = it },
                                label = { Text("City") },
                                modifier = Modifier.weight(1f),
                                singleLine = true,
                                shape = RoundedCornerShape(12.dp)
                            )
                            OutlinedTextField(
                                value = state,
                                onValueChange = { state = it },
                                label = { Text("State") },
                                modifier = Modifier.width(100.dp),
                                singleLine = true,
                                shape = RoundedCornerShape(12.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Only your city is shown publicly, never your exact location.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            // Age requirement note
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.PersonAdd,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "YP Jump is for athletes ages 13-22",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // Continue button
            Button(
                onClick = {
                    if (!isAgeValid) {
                        showAgeError = true
                    } else {
                        isLoading = true
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(12.dp),
                enabled = isFormValid && !isLoading
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                } else {
                    Text(
                        text = "Continue",
                        style = MaterialTheme.typography.titleMedium
                    )
                }
            }
        }
    }

    // Age error dialog
    if (showAgeError) {
        AlertDialog(
            onDismissRequest = { showAgeError = false },
            title = { Text("Age Requirement") },
            text = { Text("You must be 13 or older to use YP Jump.") },
            confirmButton = {
                TextButton(onClick = { showAgeError = false }) {
                    Text("OK")
                }
            }
        )
    }
}

@Composable
fun HeaderSection() {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Default.PersonAdd,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(60.dp)
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Let's set up your profile",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold
        )

        Text(
            text = "This info helps us match you with athletes in your area and age group.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )
    }
}

@Preview(showBackground = true)
@Composable
fun OnboardingScreenPreview() {
    YPJumpTheme {
        OnboardingScreen(onComplete = {})
    }
}
