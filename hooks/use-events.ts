import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
	ApiError,
	DataResponse,
	EventData,
	EventDetailData,
	EventDetailQuery,
	EventsQuery,
	PopularEventsQuery,
} from "@/types/api";

export const useEvents = (params?: EventsQuery) => {
	return useQuery<EventData[], ApiError>({
		queryKey: ["events", params],
		queryFn: async () => {
			const response = await apiClient.get<DataResponse<EventData[]>>(
				"/api/events/",
				params,
			);
			return response.data || [];
		},
		staleTime: 2 * 60 * 1000, // 2 minutes
		refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for live updates
	});
};

export const useEventDetail = (eventId: number, params?: EventDetailQuery) => {
	return useQuery<EventDetailData, ApiError>({
		queryKey: ["events", eventId, params],
		queryFn: async () => {
			const response = await apiClient.get<DataResponse<EventDetailData>>(
				`/api/events/${eventId}`,
				params,
			);
			if (!response.data) {
				throw new Error("Event detail data is missing in response");
			}
			return response.data;
		},
		enabled: !!eventId,
		staleTime: 1 * 60 * 1000, // 1 minute
		refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes for live updates
	});
};

export const usePopularEvents = (params?: PopularEventsQuery) => {
	return useQuery<EventData[], ApiError>({
		queryKey: ["events", "popular", params],
		queryFn: async () => {
			const response = await apiClient.get<DataResponse<EventData[]>>(
				"/api/events/trending/popular",
				params,
			);
			return response.data || [];
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
	});
};

export const useEventsWithFilters = () => {
	// Calculate date ranges at the top level
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const now = new Date();
	const weekFromNow = new Date(now);
	weekFromNow.setDate(weekFromNow.getDate() + 7);

	// Call all hooks at the top level
	const events = useEvents();
	const popularEvents = usePopularEvents({ limit: 10 });
	const todaysEvents = useEvents({
		date_from: today.toISOString(),
		date_to: tomorrow.toISOString(),
		include_stats: true,
		limit: 50,
	});
	const upcomingEvents = useEvents({
		date_from: now.toISOString(),
		date_to: weekFromNow.toISOString(),
		include_stats: true,
		limit: 50,
	});

	return {
		// Default events
		events,
		// Popular events
		popularEvents,
		// Time-based filters
		todaysEvents,
		upcomingEvents,
	};
};

// Separate hooks for dynamic filtering
export const useEventsByCategory = (category: string) =>
	useEvents({ category, limit: 20 });

export const useEventsByTeam = (team: string) => useEvents({ team, limit: 20 });

export const useEventsWithStats = () =>
	useEvents({ include_stats: true, limit: 20 });
