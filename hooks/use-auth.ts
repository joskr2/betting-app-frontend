import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { 
  DataResponse,
  AuthData,
  UserLoginRequest, 
  UserRegistrationRequest, 
  UserProfileData,
  ApiError
} from '@/types/api'

export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation<DataResponse<AuthData>, ApiError, UserLoginRequest>({
    mutationFn: async (credentials) => {
      const response = await apiClient.post<DataResponse<AuthData>>('/api/auth/login', credentials)
      if (response.data?.token) {
        apiClient.setToken(response.data.token)
      }
      return response
    },
    onSuccess: (data) => {
      if (data.data?.user) {
        queryClient.setQueryData(['auth', 'profile'], data.data.user)
      }
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useMutation<DataResponse<AuthData>, ApiError, UserRegistrationRequest>({
    mutationFn: async (userData) => {
      const response = await apiClient.post<DataResponse<AuthData>>('/api/auth/register', userData)
      if (response.data?.token) {
        apiClient.setToken(response.data.token)
      }
      return response
    },
    onSuccess: (data) => {
      if (data.data?.user) {
        queryClient.setQueryData(['auth', 'profile'], data.data.user)
      }
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  
  return useMutation<DataResponse<any>, ApiError, void>({
    mutationFn: async () => {
      try {
        const response = await apiClient.post<DataResponse<any>>('/api/auth/logout')
        return response
      } catch (error) {
        // Even if API call fails, we still want to logout locally
        console.warn('Logout API call failed, but proceeding with local logout')
        return { success: true, message: 'Logged out locally', timestamp: new Date().toISOString() }
      } finally {
        // Always clear token regardless of API success/failure
        apiClient.setToken(null)
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'profile'], null)
      queryClient.removeQueries({ queryKey: ['auth'] })
      queryClient.removeQueries({ queryKey: ['bets'] })
      queryClient.removeQueries({ queryKey: ['events'] })
    },
    onError: () => {
      // Force cleanup even on error
      apiClient.setToken(null)
      queryClient.setQueryData(['auth', 'profile'], null)
      queryClient.removeQueries({ queryKey: ['auth'] })
      queryClient.removeQueries({ queryKey: ['bets'] })
      queryClient.removeQueries({ queryKey: ['events'] })
    },
  })
}

export const useProfile = () => {
  // Allow disabling profile queries via environment variable
  const isProfileDisabled = process.env.NEXT_PUBLIC_DISABLE_PROFILE_QUERY === 'true'
  const enableProfileQuery = !isProfileDisabled && !!apiClient.getToken()

  return useQuery<UserProfileData, ApiError>({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const token = apiClient.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }
      const response = await apiClient.get<DataResponse<UserProfileData>>('/api/auth/profile')
      return response.data!
    },
    enabled: enableProfileQuery,
    staleTime: 10 * 60 * 1000, // 10 minutes - increase cache time
    gcTime: 15 * 60 * 1000, // 15 minutes - keep in cache longer
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized) or 500 (server error)
      if (error?.status === 401) {
        apiClient.setToken(null)
        return false
      }
      if (error?.status === 500) {
        return false // Don't retry server errors
      }
      return failureCount < 2 // Reduce retry attempts
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  })
}

export const useAuth = () => {
  const hasToken = !!apiClient.getToken()
  const isProfileDisabled = process.env.NEXT_PUBLIC_DISABLE_PROFILE_QUERY === 'true'
  const { data: profile, isLoading, error } = useProfile()
  const login = useLogin()
  const register = useRegister()
  const logout = useLogout()

  // Only provide mock user data when profile query is disabled AND token exists
  const mockUser: UserProfileData | null = (isProfileDisabled && hasToken) ? {
    id: 1,
    email: "user@example.com",
    fullName: "Usuario Demo",
    balance: 1500.0,
    createdAt: new Date().toISOString(),
    totalBets: 5,
    totalBetAmount: 750.0,
  } : null

  const user = isProfileDisabled ? mockUser : profile
  const isAuthenticated = isProfileDisabled ? !!mockUser : !!profile

  // Add debugging info
  if (typeof window !== 'undefined') {
    console.log('Auth Debug:', {
      hasToken,
      isProfileDisabled,
      mockUser: !!mockUser,
      profile: !!profile,
      isAuthenticated,
      tokenInStorage: !!localStorage.getItem('auth_token')
    })
  }
  
  return {
    user,
    isLoading: hasToken && !isProfileDisabled ? isLoading : false,
    error: isProfileDisabled ? null : error,
    isAuthenticated,
    hasToken,
    login,
    register,
    logout,
  }
}