import axios from "axios"
import { BASE_URL } from "./api-constant"
import { toast } from "sonner"

const AUTH_TOKEN_KEY = "authToken"

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "*/*"
  },
})

export const setApiAccessToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common.Authorization
  }

  if (typeof window === "undefined") {
    return
  }

  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

// Flag to avoid duplicate 401 handling
let isAuthErrorHandled = false

// Only add interceptors in browser environment
if (typeof window !== "undefined") {
  apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.data && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json"
    }

    return config
  })

  apiClient.interceptors.response.use(
    response => {
      isAuthErrorHandled = false
      return response
    },
    async error => {
      if ((error.response?.status === 401 || error.response?.status === 403) && !isAuthErrorHandled) {
        isAuthErrorHandled = true
        toast.error("Session expired. Please log in again.")
        try {
          setApiAccessToken(null)
          localStorage.removeItem("authUser")
          document.getElementById("getToken")?.click()
        } catch {}
        window.location.href = "/login"
      }
      return Promise.reject(error)
    },
  )
}

export default apiClient
