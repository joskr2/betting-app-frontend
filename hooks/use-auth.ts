import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ErrorHandler } from "@/lib/error-handler";
import type {
	ApiError,
	AuthData,
	DataResponse,
	UserLoginRequest,
	UserProfileData,
	UserRegistrationRequest,
} from "@/types/api";

export const useLogin = () => {
	const queryClient = useQueryClient();

	return useMutation<DataResponse<AuthData>, ApiError, UserLoginRequest>({
		mutationFn: async (credentials) => {
			const response = await apiClient.post<DataResponse<AuthData>>(
				"/api/auth/login",
				credentials,
			);
			console.log("🔐 Login response data:", response.data);

			// Check if BFF is returning mock response
			if (ErrorHandler.isBffMockResponse(response)) {
				ErrorHandler.handleBffMockResponse("login");
				throw new Error("BFF está en modo de prueba - la funcionalidad de login no está disponible");
			}

			if (response.data?.token) {
				apiClient.setToken(response.data.token);
				ErrorHandler.showOperationToast("login", "success");
			}
			return response;
		},
		onSuccess: (data) => {
			console.log("✅ Login success, extracting user data:", data.data);

			// Extract user profile from login response
			if (data.data) {
				const userProfile: UserProfileData = {
					id: 1, // Default ID since not provided
					email: data.data.email || "",
					fullName: data.data.fullName || "", // Note: API returns full_name
					balance: data.data.balance || 0,
					createdAt: new Date().toISOString(),
					totalBets: 0, // Default values
					totalBetAmount: 0,
				};

				console.log("👤 Setting user profile in cache:", userProfile);
				queryClient.setQueryData(["auth", "profile"], userProfile);
			}

			// Don't invalidate auth queries since we just set the profile data
			// queryClient.invalidateQueries({ queryKey: ['auth'] })
		},
		onError: (error) => {
			ErrorHandler.handleApiError(error, { operation: "login" });
		},
	});
};

export const useRegister = () => {
	const queryClient = useQueryClient();

	return useMutation<DataResponse<AuthData>, ApiError, UserRegistrationRequest>(
		{
			mutationFn: async (userData) => {
				const response = await apiClient.post<DataResponse<AuthData>>(
					"/api/auth/register",
					userData,
				);
				console.log("📝 Register response data:", response.data);

				// Check if BFF is returning mock response
				if (ErrorHandler.isBffMockResponse(response)) {
					ErrorHandler.handleBffMockResponse("register");
					throw new Error("BFF está en modo de prueba - la funcionalidad de registro no está disponible");
				}

				if (response.data?.token) {
					apiClient.setToken(response.data.token);
					ErrorHandler.showOperationToast("register", "success");
				}
				return response;
			},
			onSuccess: (data) => {
				console.log("✅ Register success, extracting user data:", data.data);

				// Extract user profile from register response
				if (data.data) {
					const userProfile: UserProfileData = {
						id: 1, // Default ID since not provided
						email: data.data.email || "",
						fullName: data.data.fullName || "", // Note: API returns full_name
						balance: data.data.balance || 0,
						createdAt: new Date().toISOString(),
						totalBets: 0, // Default values for new user
						totalBetAmount: 0,
					};

					console.log("👤 Setting user profile in cache:", userProfile);
					queryClient.setQueryData(["auth", "profile"], userProfile);
				}

				// Don't invalidate auth queries since we just set the profile data
				// queryClient.invalidateQueries({ queryKey: ['auth'] })
			},
			onError: (error) => {
				ErrorHandler.handleApiError(error, { operation: "register" });
			},
		},
	);
};

export const useLogout = () => {
	const queryClient = useQueryClient();

	return useMutation<DataResponse<{ message?: string }>, ApiError, void>({
		mutationFn: async () => {
			try {
				const response =
					await apiClient.post<DataResponse<{ message?: string }>>(
						"/api/auth/logout",
					);
				return response;
			} catch (_error) {
				// Even if API call fails, we still want to logout locally
				console.warn(
					"Logout API call failed, but proceeding with local logout",
				);
				return {
					success: true,
					message: "Logged out locally",
					timestamp: new Date().toISOString(),
				};
			} finally {
				// Always clear token regardless of API success/failure
				apiClient.setToken(null);
			}
		},
		onSuccess: () => {
			queryClient.setQueryData(["auth", "profile"], null);
			queryClient.removeQueries({ queryKey: ["auth"] });
			queryClient.removeQueries({ queryKey: ["bets"] });
			queryClient.removeQueries({ queryKey: ["events"] });
			ErrorHandler.showSuccess("Has cerrado sesión correctamente", "¡Hasta luego!");
		},
		onError: (error) => {
			// Force cleanup even on error
			apiClient.setToken(null);
			queryClient.setQueryData(["auth", "profile"], null);
			queryClient.removeQueries({ queryKey: ["auth"] });
			queryClient.removeQueries({ queryKey: ["bets"] });
			queryClient.removeQueries({ queryKey: ["events"] });
			ErrorHandler.handleApiError(error, { operation: "logout" });
		},
	});
};

export const useProfile = () => {
	// Allow disabling profile queries via environment variable
	const isProfileDisabled =
		process.env.NEXT_PUBLIC_DISABLE_PROFILE_QUERY === "true";
	const enableProfileQuery = !isProfileDisabled && !!apiClient.getToken();

	return useQuery<UserProfileData, ApiError>({
		queryKey: ["auth", "profile"],
		queryFn: async () => {
			const token = apiClient.getToken();
			console.log("🔑 Profile Query - Token:", token ? "EXISTS" : "NULL");

			if (!token) {
				throw new Error("No authentication token found");
			}

			console.log("🚀 Making profile request to /api/auth/profile");
			const response =
				await apiClient.get<DataResponse<UserProfileData>>("/api/auth/profile");

			console.log("📡 Profile API Response:", {
				success: response.success,
				message: response.message,
				timestamp: response.timestamp,
				data: response.data,
				fullResponse: response,
			});

			if (!response.data) {
				console.error("❌ Profile response data is null/undefined");
				throw new Error("Profile data is missing in response");
			}

			console.log("✅ Profile data extracted:", response.data);
			return response.data;
		},
		enabled: enableProfileQuery,
		staleTime: 10 * 60 * 1000, // 10 minutes - increase cache time
		gcTime: 15 * 60 * 1000, // 15 minutes - keep in cache longer
		refetchOnWindowFocus: false, // Don't refetch when window gains focus
		refetchOnMount: false, // Don't refetch when component mounts if data exists
		retry: (failureCount, error) => {
			console.log(
				"🔄 Profile query retry attempt:",
				failureCount,
				"Error:",
				error,
			);

			// Don't retry on 401 (unauthorized) or 500 (server error)
			if (error?.status === 401) {
				console.log("🚫 401 error - clearing token");
				apiClient.setToken(null);
				return false;
			}
			if (error?.status === 500) {
				console.log("🚫 500 error - not retrying");
				return false; // Don't retry server errors
			}
			return failureCount < 2; // Reduce retry attempts
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
	});
};

export const useAuth = () => {
	const hasToken = !!apiClient.getToken();
	const isProfileDisabled =
		process.env.NEXT_PUBLIC_DISABLE_PROFILE_QUERY === "true";
	const { data: profile, isLoading, error } = useProfile();
	const login = useLogin();
	const register = useRegister();
	const logout = useLogout();

	// When profile query is disabled, try to get cached profile data first
	const queryClient = useQueryClient();
	const cachedProfile = isProfileDisabled
		? queryClient.getQueryData<UserProfileData>(["auth", "profile"])
		: null;

	const user = isProfileDisabled ? cachedProfile : profile;
	const isAuthenticated = isProfileDisabled
		? !!cachedProfile && hasToken
		: !!profile;

	// Add debugging info
	if (typeof window !== "undefined") {
		console.log("Auth Debug:", {
			hasToken,
			isProfileDisabled,
			cachedProfile: !!cachedProfile,
			profile: !!profile,
			isAuthenticated,
			user: user
				? {
						email: (user as UserProfileData).email,
						fullName: (user as UserProfileData).fullName,
					}
				: null,
			tokenInStorage: !!localStorage.getItem("auth_token"),
		});
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
	};
};
