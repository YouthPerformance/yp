package com.youthperformance.jump.data

import java.util.Calendar
import java.util.Date
import java.util.UUID

// MARK: - User Model
data class JumpUser(
    val id: String,
    val displayName: String,
    val birthYear: Int,
    val gender: Gender,
    val city: String,
    val state: String?,
    val country: String,
    val profileVisibility: ProfileVisibility,
    val showOnLeaderboards: Boolean,
    val dailyJumpsUsed: Int,
    val lastJumpResetAt: Date,
    val createdAt: Date,
    val updatedAt: Date
) {
    enum class Gender { MALE, FEMALE, OTHER }
    enum class ProfileVisibility { PUBLIC, REGIONAL, PRIVATE }

    val ageRange: String
        get() {
            val currentYear = Calendar.getInstance().get(Calendar.YEAR)
            val age = currentYear - birthYear
            return when (age) {
                in 13..14 -> "13-14"
                in 15..16 -> "15-16"
                in 17..18 -> "17-18"
                in 19..22 -> "19-22"
                else -> "Unknown"
            }
        }

    val remainingJumps: Int
        get() = maxOf(0, 20 - dailyJumpsUsed)

    companion object {
        fun mock() = JumpUser(
            id = "user_123",
            displayName = "JumpKing23",
            birthYear = 2008,
            gender = Gender.MALE,
            city = "Houston",
            state = "TX",
            country = "US",
            profileVisibility = ProfileVisibility.PUBLIC,
            showOnLeaderboards = true,
            dailyJumpsUsed = 5,
            lastJumpResetAt = Date(),
            createdAt = Date(System.currentTimeMillis() - 86400000L * 30),
            updatedAt = Date()
        )
    }
}

// MARK: - Jump Model
data class Jump(
    val id: String,
    val userId: String,
    val heightInches: Double,
    val heightCm: Double,
    val confidence: Confidence,
    val verificationTier: VerificationTier,
    val videoStorageId: String?,
    val verificationPayload: VerificationPayload?,
    val isPractice: Boolean,
    val status: JumpStatus,
    val gpsCity: String?,
    val gpsState: String?,
    val gpsCountry: String?,
    val createdAt: Date
) {
    enum class Confidence { HIGH, MEDIUM, LOW }
    enum class VerificationTier { BRONZE, SILVER, GOLD, PLATINUM }
    enum class JumpStatus { PROCESSING, COMPLETE, FLAGGED, CHALLENGED }

    companion object {
        fun mockJumps(): List<Jump> = listOf(
            Jump(
                id = "jump_001",
                userId = "user_123",
                heightInches = 32.5,
                heightCm = 82.55,
                confidence = Confidence.HIGH,
                verificationTier = VerificationTier.SILVER,
                videoStorageId = "video_001",
                verificationPayload = null,
                isPractice = false,
                status = JumpStatus.COMPLETE,
                gpsCity = "Houston",
                gpsState = "TX",
                gpsCountry = "US",
                createdAt = Date(System.currentTimeMillis() - 3600000L)
            ),
            Jump(
                id = "jump_002",
                userId = "user_123",
                heightInches = 31.2,
                heightCm = 79.25,
                confidence = Confidence.HIGH,
                verificationTier = VerificationTier.SILVER,
                videoStorageId = "video_002",
                verificationPayload = null,
                isPractice = false,
                status = JumpStatus.COMPLETE,
                gpsCity = "Houston",
                gpsState = "TX",
                gpsCountry = "US",
                createdAt = Date(System.currentTimeMillis() - 7200000L)
            ),
            Jump(
                id = "jump_003",
                userId = "user_123",
                heightInches = 30.8,
                heightCm = 78.23,
                confidence = Confidence.MEDIUM,
                verificationTier = VerificationTier.BRONZE,
                videoStorageId = "video_003",
                verificationPayload = null,
                isPractice = false,
                status = JumpStatus.COMPLETE,
                gpsCity = null,
                gpsState = null,
                gpsCountry = null,
                createdAt = Date(System.currentTimeMillis() - 86400000L)
            ),
            Jump(
                id = "jump_004",
                userId = "user_123",
                heightInches = 28.5,
                heightCm = 72.39,
                confidence = Confidence.LOW,
                verificationTier = VerificationTier.BRONZE,
                videoStorageId = "video_004",
                verificationPayload = null,
                isPractice = true,
                status = JumpStatus.COMPLETE,
                gpsCity = null,
                gpsState = null,
                gpsCountry = null,
                createdAt = Date(System.currentTimeMillis() - 172800000L)
            )
        )

        fun mockBest(): Jump = mockJumps().maxByOrNull { it.heightInches }!!
    }
}

// MARK: - Verification Payload
data class VerificationPayload(
    val videoHash: String,
    val deviceModel: String,
    val osVersion: String,
    val appVersion: String,
    val gpsLat: Double?,
    val gpsLng: Double?,
    val gpsAccuracy: Double?,
    val captureTimestamp: Date,
    val aiModelVersion: String,
    val playIntegrityToken: String? // Android Play Integrity
)

// MARK: - Leaderboard Entry
data class LeaderboardEntry(
    val id: String,
    val userId: String,
    val displayName: String,
    val bestHeightInches: Double,
    val verificationTier: Jump.VerificationTier,
    val ageGroup: String,
    val gender: JumpUser.Gender,
    val city: String,
    val state: String?,
    val country: String,
    val rankGlobal: Int?,
    val rankCountry: Int?,
    val rankState: Int?,
    val rankCity: Int?,
    val updatedAt: Date
) {
    companion object {
        fun mockLeaderboard(): List<LeaderboardEntry> = listOf(
            LeaderboardEntry(
                id = "lb_001",
                userId = "user_456",
                displayName = "SkyHighMike",
                bestHeightInches = 42.5,
                verificationTier = Jump.VerificationTier.SILVER,
                ageGroup = "17-18",
                gender = JumpUser.Gender.MALE,
                city = "Los Angeles",
                state = "CA",
                country = "US",
                rankGlobal = 1,
                rankCountry = 1,
                rankState = 1,
                rankCity = 1,
                updatedAt = Date()
            ),
            LeaderboardEntry(
                id = "lb_002",
                userId = "user_789",
                displayName = "JumpMaster99",
                bestHeightInches = 41.2,
                verificationTier = Jump.VerificationTier.SILVER,
                ageGroup = "17-18",
                gender = JumpUser.Gender.MALE,
                city = "Chicago",
                state = "IL",
                country = "US",
                rankGlobal = 2,
                rankCountry = 2,
                rankState = 1,
                rankCity = 1,
                updatedAt = Date()
            ),
            LeaderboardEntry(
                id = "lb_003",
                userId = "user_101",
                displayName = "AirTime_Alex",
                bestHeightInches = 40.8,
                verificationTier = Jump.VerificationTier.SILVER,
                ageGroup = "15-16",
                gender = JumpUser.Gender.MALE,
                city = "Houston",
                state = "TX",
                country = "US",
                rankGlobal = 3,
                rankCountry = 3,
                rankState = 1,
                rankCity = 1,
                updatedAt = Date()
            ),
            LeaderboardEntry(
                id = "lb_004",
                userId = "user_123",
                displayName = "JumpKing23",
                bestHeightInches = 32.5,
                verificationTier = Jump.VerificationTier.SILVER,
                ageGroup = "15-16",
                gender = JumpUser.Gender.MALE,
                city = "Houston",
                state = "TX",
                country = "US",
                rankGlobal = 127,
                rankCountry = 45,
                rankState = 12,
                rankCity = 5,
                updatedAt = Date()
            ),
            LeaderboardEntry(
                id = "lb_005",
                userId = "user_202",
                displayName = "FlightQueen",
                bestHeightInches = 38.5,
                verificationTier = Jump.VerificationTier.SILVER,
                ageGroup = "17-18",
                gender = JumpUser.Gender.FEMALE,
                city = "Miami",
                state = "FL",
                country = "US",
                rankGlobal = 4,
                rankCountry = 4,
                rankState = 1,
                rankCity = 1,
                updatedAt = Date()
            )
        )
    }
}
