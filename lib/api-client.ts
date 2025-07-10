import { ApiError } from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined')
}

export class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE_URL || '') {
    this.baseUrl = baseUrl
    // Try to get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
      // Validate token format (basic check)
      if (this.token && !this.isValidTokenFormat(this.token)) {
        this.token = null
        localStorage.removeItem('auth_token')
      }
    }
  }

  private isValidTokenFormat(token: string): boolean {
    // Basic JWT format validation (should have 3 parts separated by dots)
    return token.split('.').length === 3 && token.length > 20
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  getToken(): string | null {
    return this.token
  }

  // Force clear all auth data (for debugging)
  forceLogout(): void {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user') // Clear old format too
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...options.headers,
    })

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`)
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    try {
      console.log('🌐 API Request:', { method: config.method || 'GET', url, hasToken: !!this.token })
      const response = await fetch(url, config)
      
      console.log('📥 API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      if (!response.ok) {
        let errorData: any
        try {
          errorData = await response.json()
        } catch {
          errorData = { message: 'Network error' }
        }
        
        // Handle BFF validation errors
        let message = 'An error occurred'
        if (errorData.detail && Array.isArray(errorData.detail)) {
          // FastAPI validation errors
          message = errorData.detail.map((err: any) => err.msg).join(', ')
        } else if (errorData.message) {
          message = errorData.message
        } else if (errorData.title) {
          message = errorData.title
        } else if (typeof errorData === 'string') {
          message = errorData
        }
        
        const error: ApiError = {
          message,
          status: response.status,
          details: errorData.detail || errorData.errors,
        }
        
        console.error('API Error:', error)
        throw error
      }

      // Handle empty responses
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        console.log('📄 Empty response (204 or content-length 0)')
        return {} as T
      }

      const jsonResponse = await response.json()
      console.log('📊 Parsed JSON Response:', jsonResponse)
      return jsonResponse
    } catch (error) {
      if (error instanceof TypeError) {
        throw {
          message: 'Network error - please check your connection',
          status: 0,
        } as ApiError
      }
      throw error
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, this.baseUrl)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    
    return this.request<T>(url.pathname + url.search)
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
