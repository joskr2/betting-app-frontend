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
      const response = await apiClient.post<DataResponse<any>>('/api/auth/logout')
      apiClient.setToken(null)
      return response
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'profile'], null)
      queryClient.removeQueries({ queryKey: ['auth'] })
      queryClient.removeQueries({ queryKey: ['bets'] })
      queryClient.removeQueries({ queryKey: ['events'] })
    },
  })
}

export const useProfile = () => {
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
    enabled: !!apiClient.getToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error?.status === 401) {
        apiClient.setToken(null)
        return false
      }
      return failureCount < 3
    },
  })
}

export const useAuth = () => {
  const { data: profile, isLoading, error } = useProfile()
  const login = useLogin()
  const register = useRegister()
  const logout = useLogout()
  
  return {
    user: profile,
    isLoading,
    error,
    isAuthenticated: !!profile,
    login,
    register,
    logout,
  }
}