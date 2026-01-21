// ═══════════════════════════════════════════════════════════════
// CONVEX CLIENT
// HTTP client for Convex backend communication
// Handles mutations, queries, and file uploads
// ═══════════════════════════════════════════════════════════════

package com.youthperformance.xlens.network

import com.youthperformance.xlens.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.*
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException

/**
 * HTTP client for Convex backend
 * Maps to the jump/*.ts Convex functions
 */
internal class ConvexClient(
    private val baseUrl: String,
    private val authToken: String? = null
) {
    private val client = OkHttpClient.Builder()
        .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
        .readTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
        .writeTimeout(300, java.util.concurrent.TimeUnit.SECONDS) // 5 min for uploads
        .build()

    private val json = Json {
        ignoreUnknownKeys = true
        encodeDefaults = true
    }

    private val queryUrl = "$baseUrl/query"
    private val mutationUrl = "$baseUrl/mutation"
    private val uploadUrl = "$baseUrl/upload"

    // MARK: - Session Management

    @Serializable
    data class CreateSessionResponse(
        val sessionId: String,
        val nonce: String,
        val nonceDisplay: String,
        val expiresAt: Long,
        val expiresInMs: Int
    )

    suspend fun createSession(userId: String, deviceKeyId: String?): CreateSessionResponse {
        val args = buildJsonObject {
            put("userId", userId)
            deviceKeyId?.let { put("deviceKeyId", it) }
        }

        return mutation("jump/sessions:create", args)
    }

    @Serializable
    data class SessionValidationResponse(
        val valid: Boolean,
        val reason: String? = null
    )

    suspend fun validateSession(sessionId: String, nonce: String): SessionValidationResponse {
        val args = buildJsonObject {
            put("sessionId", sessionId)
            put("nonce", nonce)
        }

        return query("jump/sessions:validate", args)
    }

    // MARK: - Jump Submission

    @Serializable
    data class SubmitJumpResponse(
        val jumpId: String,
        val status: String
    )

    suspend fun submitJump(
        userId: String,
        sessionId: String,
        videoStorageId: String,
        sensorStorageId: String,
        proofPayload: ProofPayload,
        gps: GPSLocation?
    ): SubmitJumpResponse {
        val args = buildJsonObject {
            put("userId", userId)
            put("sessionId", sessionId)
            put("videoStorageId", videoStorageId)
            put("sensorStorageId", sensorStorageId)
            put("proofPayload", proofPayload.toJsonObject())
            gps?.let {
                put("gps", buildJsonObject {
                    put("city", it.city)
                    it.state?.let { state -> put("state", state) }
                    put("country", it.country)
                })
            }
        }

        return mutation("jump/jumps:submit", args)
    }

    @Serializable
    data class MarkUploadedResponse(val success: Boolean)

    suspend fun markJumpUploaded(jumpId: String): MarkUploadedResponse {
        val args = buildJsonObject {
            put("jumpId", jumpId)
        }

        return mutation("jump/jumps:markUploaded", args)
    }

    // MARK: - Jump Queries

    suspend fun listJumps(userId: String, limit: Int, excludePractice: Boolean = false): List<Jump> {
        val args = buildJsonObject {
            put("userId", userId)
            put("limit", limit)
            put("excludePractice", excludePractice)
        }

        val response: List<JumpResponse> = query("jump/jumps:listForUser", args)

        return response.map { it.toJump() }
    }

    suspend fun getBestJump(userId: String, minTier: VerificationTier?): Jump? {
        val args = buildJsonObject {
            put("userId", userId)
            minTier?.let { put("minTier", it.name.lowercase()) }
        }

        val response: JumpResponse? = queryNullable("jump/jumps:getBestForUser", args)
        return response?.toJump()
    }

    // MARK: - Daily Cap

    suspend fun checkDailyCap(userId: String): DailyCapStatus {
        val args = buildJsonObject {
            put("userId", userId)
        }

        val response: CapResponse = query("jump/jumpUsers:checkDailyCap", args)

        return DailyCapStatus(
            jumpsUsed = response.jumpsUsed,
            remaining = response.remaining,
            cap = response.cap,
            isOverCap = response.isOverCap
        )
    }

    // MARK: - File Upload

    suspend fun uploadFile(data: ByteArray, contentType: String): String = withContext(Dispatchers.IO) {
        val requestBody = data.toRequestBody(contentType.toMediaType())

        val request = Request.Builder()
            .url(uploadUrl)
            .post(requestBody)
            .apply {
                authToken?.let { addHeader("Authorization", "Bearer $it") }
            }
            .build()

        val response = client.newCall(request).execute()

        if (!response.isSuccessful) {
            val message = response.body?.string() ?: "Unknown error"
            throw XLensException.UploadFailed("Status ${response.code}: $message")
        }

        val body = response.body?.string()
            ?: throw XLensException.DecodingError("Empty response body")

        val uploadResponse = json.decodeFromString<UploadResponse>(body)
        uploadResponse.storageId
    }

    // MARK: - Generic Query/Mutation

    private suspend inline fun <reified T> query(path: String, args: JsonObject): T {
        return request(queryUrl, path, args)
    }

    private suspend inline fun <reified T> queryNullable(path: String, args: JsonObject): T? {
        return try {
            request(queryUrl, path, args)
        } catch (e: XLensException.DecodingError) {
            null
        }
    }

    private suspend inline fun <reified T> mutation(path: String, args: JsonObject): T {
        return request(mutationUrl, path, args)
    }

    private suspend inline fun <reified T> request(url: String, path: String, args: JsonObject): T = withContext(Dispatchers.IO) {
        val body = buildJsonObject {
            put("path", path)
            put("args", args)
            put("format", "json")
        }

        val requestBody = json.encodeToString(body).toRequestBody("application/json".toMediaType())

        val request = Request.Builder()
            .url(url)
            .post(requestBody)
            .addHeader("Content-Type", "application/json")
            .apply {
                authToken?.let { addHeader("Authorization", "Bearer $it") }
            }
            .build()

        val response = try {
            client.newCall(request).execute()
        } catch (e: IOException) {
            throw XLensException.NetworkError(e)
        }

        if (!response.isSuccessful) {
            val message = response.body?.string() ?: "Unknown error"
            throw XLensException.ServerError(response.code, message)
        }

        val responseBody = response.body?.string()
            ?: throw XLensException.DecodingError("Empty response body")

        try {
            // Convex wraps response in { "value": ... }
            val jsonElement = json.parseToJsonElement(responseBody)
            val valueElement = jsonElement.jsonObject["value"]
                ?: throw XLensException.DecodingError("Missing 'value' in response")

            json.decodeFromJsonElement(valueElement)
        } catch (e: Exception) {
            if (e is XLensException) throw e
            throw XLensException.DecodingError(e.message ?: "Unknown decoding error")
        }
    }

    // MARK: - Response Types

    @Serializable
    private data class UploadResponse(val storageId: String)

    @Serializable
    private data class JumpResponse(
        val _id: String,
        val userId: String,
        val sessionId: String,
        val status: String,
        val heightInches: Double? = null,
        val heightCm: Double? = null,
        val flightTimeMs: Int? = null,
        val confidence: Double? = null,
        val verificationTier: String? = null,
        val isPractice: Boolean = false,
        val createdAt: Long = 0
    ) {
        fun toJump() = Jump(
            id = _id,
            status = JumpStatus.valueOf(status.uppercase()),
            sessionId = sessionId,
            heightInches = heightInches,
            heightCm = heightCm,
            flightTimeMs = flightTimeMs,
            verificationTier = verificationTier?.let { VerificationTier.valueOf(it.uppercase()) },
            confidence = confidence
        )
    }

    @Serializable
    private data class CapResponse(
        val jumpsUsed: Int,
        val remaining: Int,
        val cap: Int,
        val isOverCap: Boolean,
        val needsReset: Boolean = false
    )
}

// MARK: - Proof Payload

data class ProofPayload(
    val sessionId: String,
    val nonce: String,
    val capture: CaptureInfo,
    val hashes: Hashes,
    val signature: Signature,
    val gps: GPSCoordinates? = null
) {
    data class CaptureInfo(
        val testType: String = "VERT_JUMP",
        val startedAtMs: Long,
        val endedAtMs: Long,
        val fps: Int,
        val device: DeviceInfo
    )

    data class DeviceInfo(
        val platform: String = "android",
        val model: String,
        val osVersion: String,
        val appVersion: String
    )

    data class Hashes(
        val videoSha256: String,
        val sensorSha256: String,
        val metadataSha256: String
    )

    data class Signature(
        val alg: String = "ES256",
        val keyId: String,
        val sig: String
    )

    data class GPSCoordinates(
        val lat: Double,
        val lng: Double,
        val accuracyM: Double,
        val capturedAtMs: Long
    )

    fun toJsonObject(): JsonObject = buildJsonObject {
        put("sessionId", sessionId)
        put("nonce", nonce)
        put("capture", buildJsonObject {
            put("testType", capture.testType)
            put("startedAtMs", capture.startedAtMs)
            put("endedAtMs", capture.endedAtMs)
            put("fps", capture.fps)
            put("device", buildJsonObject {
                put("platform", capture.device.platform)
                put("model", capture.device.model)
                put("osVersion", capture.device.osVersion)
                put("appVersion", capture.device.appVersion)
            })
        })
        put("hashes", buildJsonObject {
            put("videoSha256", hashes.videoSha256)
            put("sensorSha256", hashes.sensorSha256)
            put("metadataSha256", hashes.metadataSha256)
        })
        put("signature", buildJsonObject {
            put("alg", signature.alg)
            put("keyId", signature.keyId)
            put("sig", signature.sig)
        })
        gps?.let {
            put("gps", buildJsonObject {
                put("lat", it.lat)
                put("lng", it.lng)
                put("accuracyM", it.accuracyM)
                put("capturedAtMs", it.capturedAtMs)
            })
        }
    }
}
