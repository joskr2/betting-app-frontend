import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ErrorHandler } from "@/lib/error-handler";
import type {
	ApiError,
	BetCreationRequest,
	BetData,
	BetPreviewData,
	DashboardData,
	DataResponse,
	UserBetsData,
	UserBetsQuery,
} from "@/types/api";

export const useBetPreview = () => {
	return useMutation<BetPreviewData, ApiError, BetCreationRequest>({
		mutationFn: async (betData) => {
			const response = await apiClient.post<DataResponse<BetPreviewData>>(
				"/api/bets/preview",
				betData,
			);

			// Check if BFF is returning mock response
			if (ErrorHandler.isBffMockResponse(response)) {
				ErrorHandler.handleBffMockResponse("bet");
				throw new Error("BFF está en modo de prueba - la funcionalidad de vista previa no está disponible");
			}

			if (!response.data) {
				throw new Error("Bet preview data is missing in response");
			}
			return response.data;
		},
		onError: (error) => {
			ErrorHandler.handleApiError(error, { operation: "bet" });
		},
	});
};

export const useCreateBet = () => {
	const queryClient = useQueryClient();

	return useMutation<BetData, ApiError, BetCreationRequest>({
		mutationFn: async (betData) => {
			const response = await apiClient.post<DataResponse<BetData>>(
				"/api/bets/",
				betData,
			);

			// Check if BFF is returning mock response
			if (ErrorHandler.isBffMockResponse(response)) {
				ErrorHandler.handleBffMockResponse("bet");
				throw new Error("BFF está en modo de prueba - la funcionalidad de apuestas no está disponible");
			}

			if (!response.data) {
				throw new Error("Bet creation data is missing in response");
			}
			return response.data;
		},
		onSuccess: (data) => {
			// Invalidate and refetch bets data
			queryClient.invalidateQueries({ queryKey: ["bets"] });
			queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });

			// Show success message
			ErrorHandler.showOperationToast("bet", "success");

			// Optimistically update the user's bets list
			queryClient.setQueryData(
				["bets", "my-bets"],
				(old: UserBetsData | undefined) => {
					if (old) {
						return {
							...old,
							bets: [data, ...old.bets],
							statistics: old.statistics
								? {
										...old.statistics,
										totalBets: old.statistics.totalBets + 1,
										activeBets: old.statistics.activeBets + 1,
										totalAmountBet: old.statistics.totalAmountBet + data.amount,
										currentPotentialWin:
											old.statistics.currentPotentialWin + (data.potentialWin || 0),
									}
								: undefined,
						};
					}
					return old;
				},
			);
		},
		onError: (error) => {
			ErrorHandler.handleApiError(error, { operation: "bet" });
		},
	});
};

export const useCancelBet = () => {
	const queryClient = useQueryClient();

	return useMutation<{ message?: string }, ApiError, number>({
		mutationFn: async (betId) => {
			const response = await apiClient.delete<
				DataResponse<{ message?: string }>
			>(`/api/bets/${betId}`);
			if (!response.data) {
				return { message: "Bet cancelled successfully" };
			}
			return response.data;
		},
		onSuccess: (_, betId) => {
			// Invalidate and refetch bets data
			queryClient.invalidateQueries({ queryKey: ["bets"] });
			queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });

			// Optimistically update the user's bets list
			queryClient.setQueryData(
				["bets", "my-bets"],
				(old: UserBetsData | undefined) => {
					if (old) {
						return {
							...old,
							bets: old.bets.map((bet) =>
								bet.id === betId
									? { ...bet, status: "Cancelled", canBeCancelled: false }
									: bet,
							),
							statistics: old.statistics
								? {
										...old.statistics,
										activeBets: Math.max(0, old.statistics.activeBets - 1),
									}
								: undefined,
						};
					}
					return old;
				},
			);
		},
	});
};

export const useUserBets = (params?: UserBetsQuery) => {
	return useQuery<UserBetsData, ApiError>({
		queryKey: ["bets", "my-bets", params],
		queryFn: async () => {
			// Filter out null/undefined values to match apiClient.get type requirements
			const filteredParams = params ? Object.fromEntries(
				Object.entries(params).filter(([_, value]) => value !== null && value !== undefined)
			) as Record<string, string | number | boolean> : undefined;
			
			const response = await apiClient.get<DataResponse<UserBetsData>>(
				"/api/bets/my-bets",
				filteredParams,
			);
			if (!response.data) {
				throw new Error("User bets data is missing in response");
			}
			return response.data;
		},
		enabled: !!apiClient.getToken(),
		staleTime: 1 * 60 * 1000, // 1 minute
		refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for status updates
	});
};

export const useBettingDashboard = () => {
	return useQuery<DashboardData, ApiError>({
		queryKey: ["dashboard"],
		queryFn: async () => {
			const response = await apiClient.get<DataResponse<DashboardData>>(
				"/api/bets/dashboard",
			);
			if (!response.data) {
				throw new Error("Dashboard data is missing in response");
			}
			return response.data;
		},
		enabled: !!apiClient.getToken(),
		staleTime: 2 * 60 * 1000, // 2 minutes
		refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
	});
};

export const useBetsWithFilters = () => {
	// Call all hooks at the top level
	const userBets = useUserBets({ include_statistics: true });
	const dashboard = useBettingDashboard();
	const activeBets = useUserBets({
		status_filter: "active",
		include_statistics: true,
	});
	const completedBets = useUserBets({
		status_filter: "completed",
		include_statistics: true,
		page_size: 50,
	});
	const recentBets = useUserBets({
		page_size: 10,
		include_statistics: false,
	});

	return {
		// Default user bets
		userBets,
		// Dashboard data
		dashboard,
		// Pre-loaded filtered queries
		activeBets,
		completedBets,
		recentBets,
	};
};

// Separate hooks for dynamic filtering
export const useUserBetsByDateRange = (dateFrom: string, dateTo: string) =>
	useUserBets({
		date_from: dateFrom,
		date_to: dateTo,
		include_statistics: true,
		page_size: 100,
	});

export const useUserBetsPaginated = (page: number, pageSize = 20) =>
	useUserBets({
		page,
		page_size: pageSize,
		include_statistics: page === 1, // Only include stats on first page
	});
