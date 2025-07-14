import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCardSkeleton() {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-4 w-4" />
			</CardHeader>
			<CardContent>
				<Skeleton className="h-8 w-20" />
			</CardContent>
		</Card>
	);
}

export function StatsGridSkeleton({ count = 3 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{Array.from({ length: count }, (_, i) => (
				<StatCardSkeleton key={`stat-card-${Math.random()}-${i}`} />
			))}
		</div>
	);
}

export function BetsStatsGridSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
			{Array.from({ length: 4 }, (_, i) => (
				<StatCardSkeleton key={`bet-stat-card-${Math.random()}-${i}`} />
			))}
		</div>
	);
}
