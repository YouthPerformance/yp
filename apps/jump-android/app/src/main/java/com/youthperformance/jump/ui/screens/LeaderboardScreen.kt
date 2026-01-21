package com.youthperformance.jump.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.youthperformance.jump.data.Jump
import com.youthperformance.jump.data.LeaderboardEntry
import com.youthperformance.jump.ui.theme.*

enum class LeaderboardScope(val displayName: String) {
    GLOBAL("Global"),
    COUNTRY("Country"),
    STATE("State"),
    CITY("City")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LeaderboardScreen(currentUserId: String) {
    var selectedScope by remember { mutableStateOf(LeaderboardScope.GLOBAL) }
    var selectedAgeGroup by remember { mutableStateOf("All") }
    var selectedGender by remember { mutableStateOf("All") }

    val leaderboard = LeaderboardEntry.mockLeaderboard()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Leaderboard") })
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Filters section
            FiltersSection(
                selectedScope = selectedScope,
                onScopeChange = { selectedScope = it },
                selectedAgeGroup = selectedAgeGroup,
                onAgeGroupChange = { selectedAgeGroup = it },
                selectedGender = selectedGender,
                onGenderChange = { selectedGender = it }
            )

            // Leaderboard list
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item { Spacer(modifier = Modifier.height(8.dp)) }

                itemsIndexed(leaderboard) { index, entry ->
                    LeaderboardRow(
                        rank = index + 1,
                        entry = entry,
                        isCurrentUser = entry.userId == currentUserId
                    )
                }

                item { Spacer(modifier = Modifier.height(16.dp)) }
            }
        }
    }
}

@Composable
fun FiltersSection(
    selectedScope: LeaderboardScope,
    onScopeChange: (LeaderboardScope) -> Unit,
    selectedAgeGroup: String,
    onAgeGroupChange: (String) -> Unit,
    selectedGender: String,
    onGenderChange: (String) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.surface)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Scope picker
        SingleChoiceSegmentedButtonRow(
            modifier = Modifier.fillMaxWidth()
        ) {
            LeaderboardScope.entries.forEachIndexed { index, scope ->
                SegmentedButton(
                    selected = selectedScope == scope,
                    onClick = { onScopeChange(scope) },
                    shape = SegmentedButtonDefaults.itemShape(
                        index = index,
                        count = LeaderboardScope.entries.size
                    )
                ) {
                    Text(scope.displayName)
                }
            }
        }

        // Additional filters
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            item {
                FilterChip(
                    label = "Age",
                    value = selectedAgeGroup,
                    options = listOf("All", "13-14", "15-16", "17-18", "19-22"),
                    onSelect = onAgeGroupChange
                )
            }
            item {
                FilterChip(
                    label = "Gender",
                    value = selectedGender,
                    options = listOf("All", "Male", "Female"),
                    onSelect = onGenderChange
                )
            }
        }
    }
}

@Composable
fun FilterChip(
    label: String,
    value: String,
    options: List<String>,
    onSelect: (String) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    Box {
        FilterChip(
            selected = value != "All",
            onClick = { expanded = true },
            label = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = label,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = value,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        )

        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            options.forEach { option ->
                DropdownMenuItem(
                    text = { Text(option) },
                    onClick = {
                        onSelect(option)
                        expanded = false
                    }
                )
            }
        }
    }
}

@Composable
fun LeaderboardRow(
    rank: Int,
    entry: LeaderboardEntry,
    isCurrentUser: Boolean
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .then(
                if (isCurrentUser) {
                    Modifier.border(
                        width = 2.dp,
                        color = MaterialTheme.colorScheme.primary,
                        shape = RoundedCornerShape(12.dp)
                    )
                } else Modifier
            ),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isCurrentUser)
                MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)
            else
                MaterialTheme.colorScheme.surface
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Rank
            RankBadge(rank = rank)

            Spacer(modifier = Modifier.width(16.dp))

            // Avatar
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(
                        if (isCurrentUser)
                            MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)
                        else
                            Color.Gray.copy(alpha = 0.2f)
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = entry.displayName.take(1),
                    style = MaterialTheme.typography.titleMedium,
                    color = if (isCurrentUser)
                        MaterialTheme.colorScheme.primary
                    else
                        Color.Gray
                )
            }

            Spacer(modifier = Modifier.width(12.dp))

            // User info
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = entry.displayName,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    if (isCurrentUser) {
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "(You)",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "${entry.city}, ${entry.state ?: ""}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = " • ",
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = entry.ageGroup,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            // Height + badge
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = String.format("%.1f\"", entry.bestHeightInches),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                SmallVerificationBadge(tier = entry.verificationTier)
            }
        }
    }
}

@Composable
fun RankBadge(rank: Int) {
    val (backgroundColor, textColor) = when (rank) {
        1 -> GoldColor to Color.White
        2 -> SilverColor to Color.White
        3 -> BronzeColor to Color.White
        else -> Color.Transparent to MaterialTheme.colorScheme.onSurfaceVariant
    }

    if (rank <= 3) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(backgroundColor),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = rank.toString(),
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = textColor
            )
        }
    } else {
        Box(
            modifier = Modifier.width(36.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = rank.toString(),
                style = MaterialTheme.typography.titleMedium,
                color = textColor
            )
        }
    }
}

@Composable
fun SmallVerificationBadge(tier: Jump.VerificationTier) {
    val color = when (tier) {
        Jump.VerificationTier.BRONZE -> BronzeColor
        Jump.VerificationTier.SILVER -> SilverColor
        Jump.VerificationTier.GOLD -> GoldColor
        Jump.VerificationTier.PLATINUM -> PlatinumColor
    }

    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(
            imageVector = Icons.Default.Shield,
            contentDescription = null,
            tint = color,
            modifier = Modifier.size(12.dp)
        )
        Spacer(modifier = Modifier.width(2.dp))
        Text(
            text = tier.name.first().toString(),
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = color
        )
    }
}

@Preview(showBackground = true)
@Composable
fun LeaderboardScreenPreview() {
    YPJumpTheme {
        LeaderboardScreen(currentUserId = "user_123")
    }
}
