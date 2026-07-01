package com.medsolution.admin.data.api

import android.util.Log
import com.google.gson.Gson
import com.medsolution.admin.BuildConfig
import com.medsolution.admin.data.model.*
import com.medsolution.admin.util.SessionManager
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException
import java.util.concurrent.TimeUnit

class ApiClient(private val sessionManager: SessionManager) {

    private val gson = Gson()
    private val jsonMediaType = "application/json".toMediaType()

    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .addInterceptor { chain ->
            val original = chain.request()
            val builder = original.newBuilder()
            val token = sessionManager.sessionToken
            if (token != null) {
                builder.addHeader("Cookie", "admin_session=$token")
            }
            chain.proceed(builder.build())
        }
        .build()

    private val workerClient = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .addInterceptor { chain ->
            val original = chain.request()
            val builder = original.newBuilder()
                .addHeader("x-api-token", BuildConfig.EMAIL_WORKER_TOKEN)
            chain.proceed(builder.build())
        }
        .build()

    fun login(email: String, password: String): Result<LoginResponse> {
        return post("${BuildConfig.BASE_URL}/api/admin/login", LoginRequest(email, password))
    }

    fun logout(): Result<LoginResponse> {
        return post("${BuildConfig.BASE_URL}/api/admin/logout", Unit)
    }

    fun getLeads(): Result<LeadsResponse> {
        return get("${BuildConfig.BASE_URL}/api/admin/leads")
    }

    fun updateLeadStatus(id: String, status: String): Result<LeadUpdateResponse> {
        return patch("${BuildConfig.BASE_URL}/api/admin/leads", LeadUpdateRequest(id, status))
    }

    fun getDashboard(): Result<DashboardData> {
        return get("${BuildConfig.BASE_URL}/api/admin/leads-data")
    }

    fun getEmails(cursor: String? = null, limit: Int = 50, search: String? = null): Result<EmailsResponse> {
        val url = buildString {
            append("${BuildConfig.BASE_URL}/api/admin/emails")
            val params = mutableListOf<String>()
            if (cursor != null) params.add("cursor=$cursor")
            params.add("limit=$limit")
            if (search != null) params.add("search=${search.replace(" ", "%20")}")
            if (params.isNotEmpty()) append("?${params.joinToString("&")}")
        }
        return get(url)
    }

    fun getEmail(id: Int): Result<Email> {
        return get("${BuildConfig.BASE_URL}/api/admin/emails/$id")
    }

    fun getEmailAttachments(id: Int): Result<List<Attachment>> {
        return get("${BuildConfig.BASE_URL}/api/admin/emails/$id/attachments")
    }

    fun sendEmail(request: EmailWorkerRequest): Result<EmailWorkerResponse> {
        return postWorker("${BuildConfig.EMAIL_WORKER_URL}/api/emails/send", request)
    }

    fun deleteEmail(id: Int): Result<EmailWorkerResponse> {
        return delete("${BuildConfig.BASE_URL}/api/admin/emails/$id")
    }

    fun getEmailWorker(cursor: String? = null, limit: Int = 50): Result<EmailsResponse> {
        val url = buildString {
            append("${BuildConfig.EMAIL_WORKER_URL}/api/emails")
            val params = mutableListOf<String>()
            if (cursor != null) params.add("cursor=$cursor")
            params.add("limit=$limit")
            if (params.isNotEmpty()) append("?${params.joinToString("&")}")
        }
        return getWorker(url)
    }

    private inline fun <reified T> get(url: String): Result<T> {
        return try {
            val request = Request.Builder().url(url).get().build()
            val response = client.newCall(request).execute()
            val body = response.body?.string()
            Log.d("ApiClient", "GET $url -> ${response.code}")
            if (response.isSuccessful && body != null) {
                Result.success(gson.fromJson(body, T::class.java))
            } else {
                val err = parseError(body)
                Result.failure(IOException("HTTP ${response.code}: $err"))
            }
        } catch (e: Exception) {
            Log.e("ApiClient", "GET $url failed", e)
            Result.failure(e)
        }
    }

    private inline fun <reified T> post(url: String, body: Any): Result<T> {
        return try {
            val json = gson.toJson(body)
            val requestBody = json.toRequestBody(jsonMediaType)
            val request = Request.Builder().url(url).post(requestBody).build()
            val response = client.newCall(request).execute()
            val responseBody = response.body?.string()
            Log.d("ApiClient", "POST $url -> ${response.code}")
            if (response.isSuccessful && responseBody != null) {
                Result.success(gson.fromJson(responseBody, T::class.java))
            } else {
                val err = parseError(responseBody)
                Result.failure(IOException("HTTP ${response.code}: $err"))
            }
        } catch (e: Exception) {
            Log.e("ApiClient", "POST $url failed", e)
            Result.failure(e)
        }
    }

    private inline fun <reified T> patch(url: String, body: Any): Result<T> {
        return try {
            val json = gson.toJson(body)
            val requestBody = json.toRequestBody(jsonMediaType)
            val request = Request.Builder().url(url).patch(requestBody).build()
            val response = client.newCall(request).execute()
            val responseBody = response.body?.string()
            Log.d("ApiClient", "PATCH $url -> ${response.code}")
            if (response.isSuccessful && responseBody != null) {
                Result.success(gson.fromJson(responseBody, T::class.java))
            } else {
                val err = parseError(responseBody)
                Result.failure(IOException("HTTP ${response.code}: $err"))
            }
        } catch (e: Exception) {
            Log.e("ApiClient", "PATCH $url failed", e)
            Result.failure(e)
        }
    }

    private inline fun <reified T> delete(url: String): Result<T> {
        return try {
            val request = Request.Builder().url(url).delete().build()
            val response = client.newCall(request).execute()
            val responseBody = response.body?.string()
            Log.d("ApiClient", "DELETE $url -> ${response.code}")
            if (response.isSuccessful && responseBody != null) {
                Result.success(gson.fromJson(responseBody, T::class.java))
            } else {
                val err = parseError(responseBody)
                Result.failure(IOException("HTTP ${response.code}: $err"))
            }
        } catch (e: Exception) {
            Log.e("ApiClient", "DELETE $url failed", e)
            Result.failure(e)
        }
    }

    private inline fun <reified T> getWorker(url: String): Result<T> {
        return try {
            val request = Request.Builder().url(url).get().build()
            val response = workerClient.newCall(request).execute()
            val body = response.body?.string()
            Log.d("ApiClient", "WORKER GET $url -> ${response.code}")
            if (response.isSuccessful && body != null) {
                Result.success(gson.fromJson(body, T::class.java))
            } else {
                val err = parseError(body)
                Result.failure(IOException("HTTP ${response.code}: $err"))
            }
        } catch (e: Exception) {
            Log.e("ApiClient", "WORKER GET $url failed", e)
            Result.failure(e)
        }
    }

    private inline fun <reified T> postWorker(url: String, body: Any): Result<T> {
        return try {
            val json = gson.toJson(body)
            val requestBody = json.toRequestBody(jsonMediaType)
            val request = Request.Builder().url(url).post(requestBody).build()
            val response = workerClient.newCall(request).execute()
            val responseBody = response.body?.string()
            Log.d("ApiClient", "WORKER POST $url -> ${response.code}")
            if (response.isSuccessful && responseBody != null) {
                Result.success(gson.fromJson(responseBody, T::class.java))
            } else {
                val err = parseError(responseBody)
                Result.failure(IOException("HTTP ${response.code}: $err"))
            }
        } catch (e: Exception) {
            Log.e("ApiClient", "WORKER POST $url failed", e)
            Result.failure(e)
        }
    }

    private fun parseError(body: String?): String {
        if (body.isNullOrBlank()) return "Unknown error"
        return try {
            val err = gson.fromJson(body, Map::class.java)
            (err["error"] ?: err["message"] ?: body).toString()
        } catch (_: Exception) {
            body.take(200)
        }
    }
}
