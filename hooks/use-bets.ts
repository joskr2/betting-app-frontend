import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { 
  DataResponse,
  BetData,
  BetPreviewData,
  BetCreationRequest,
  UserBetsData,
  UserBetsQuery,
  DashboardData,
  ApiError
} from '@/types/api'

export const useBetPreview = () => {
  return useMutation<BetPreviewData, ApiError, BetCreationRequest>({
    mutationFn: async (betData) => {
      const response = await apiClient.post<DataResponse<BetPreviewData>>('/api/bets/preview', betData)
      return response.data!
    },
  })
}

export const useCreateBet = () => {
  const queryClient = useQueryClient()
  
  return useMutation<BetData, ApiError, BetCreationRequest>({
    mutationFn: async (betData) => {
      const response = await apiClient.post<DataResponse<BetData>>('/api/bets/', betData)
      return response.data!
    },
    onSuccess: (data) => {
      // Invalidate and refetch bets data
      queryClient.invalidateQueries({ queryKey: ['bets'] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      
      // Optimistically update the user's bets list
      queryClient.setQueryData(['bets', 'my-bets'], (old: UserBetsData | undefined) => {
        if (old) {
          return {
            ...old,
            bets: [data, ...old.bets],
            statistics: old.statistics ? {
              ...old.statistics,
              totalBets: old.statistics.totalBets + 1,
              activeBets: old.statistics.activeBets + 1,
              totalAmountBet: old.statistics.totalAmountBet + data.amount,
              currentPotentialWin: old.statistics.currentPotentialWin + data.potentialWin,
            } : undefined
          }
        }
        return old
      })
    },
  })
}

export const useCancelBet = () => {
  const queryClient = useQueryClient()
  
  return useMutation<any, ApiError, number>({
    mutationFn: async (betId) => {
      const response = await apiClient.delete<DataResponse<any>>(`/api/bets/${betId}`)
      return response.data
    },
    onSuccess: (_, betId) => {
      // Invalidate and refetch bets data
      queryClient.invalidateQueries({ queryKey: ['bets'] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      
      // Optimistically update the user's bets list
      queryClient.setQueryData(['bets', 'my-bets'], (old: UserBetsData | undefined) => {
        if (old) {
          return {
            ...old,
            bets: old.bets.map(bet => 
              bet.id === betId 
                ? { ...bet, status: 'Cancelled', canBeCancelled: false }
                : bet
            ),
            statistics: old.statistics ? {
              ...old.statistics,
              activeBets: Math.max(0, old.statistics.activeBets - 1),
            } : undefined
          }
        }
        return old
      })
    },
  })
}

export const useUserBets = (params?: UserBetsQuery) => {
  return useQuery<UserBetsData, ApiError>({
    queryKey: ['bets', 'my-bets', params],
    queryFn: async () => {
      const response = await apiClient.get<DataResponse<UserBetsData>>('/api/bets/my-bets', params)
      return response.data!
    },
    enabled: !!apiClient.getToken(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for status updates
  })
}

export const useBettingDashboard = () => {
  return useQuery<DashboardData, ApiError>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await apiClient.get<DataResponse<DashboardData>>('/api/bets/dashboard')
      return response.data!
    },
    enabled: !!apiClient.getToken(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  })
}

export const useBetsWithFilters = () => {
  return {
    // Default user bets
    userBets: useUserBets({ include_statistics: true }),
    
    // Dashboard data
    dashboard: useBettingDashboard(),
    
    // Helper functions for filtered queries
    getActiveBets: () => useUserBets({ 
      status_filter: 'active',
      include_statistics: true 
    }),
    
    getCompletedBets: () => useUserBets({ 
      status_filter: 'completed',
      include_statistics: true,
      page_size: 50
    }),
    
    getRecentBets: () => useUserBets({ 
      page_size: 10,
      include_statistics: false
    }),
    
    getBetsByDateRange: (dateFrom: string, dateTo: string) => useUserBets({
      date_from: dateFrom,
      date_to: dateTo,
      include_statistics: true,
      page_size: 100
    }),
    
    // Pagination helpers
    getBetsPaginated: (page: number, pageSize: number = 20) => useUserBets({
      page,
      page_size: pageSize,
      include_statistics: page === 1 // Only include stats on first page
    }),
  }
}