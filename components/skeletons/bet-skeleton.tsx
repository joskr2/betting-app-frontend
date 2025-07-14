import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BetSkeleton() {
	return (
		<Card>
			<CardHeader>
				<div className="flex justify-between items-start">
					<div className="flex-1">
						<Skeleton className="h-6 w-3/4 mb-2" />
						<div className="flex items-center space-x-4">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-20" />
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Skeleton className="h-6 w-16" />
						<Skeleton className="h-8 w-8" />
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<div className="space-y-4">
					{/* Bet Details */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Skeleton className="h-4 w-16 mb-1" />
							<Skeleton className="h-5 w-20" />
						</div>
						<div>
							<Skeleton className="h-4 w-12 mb-1" />
							<Skeleton className="h-5 w-16" />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<Skeleton className="h-4 w-20 mb-1" />
							<Skeleton className="h-5 w-24" />
						</div>
						<div>
							<Skeleton className="h-4 w-24 mb-1" />
							<Skeleton className="h-5 w-20" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function BetListSkeleton({ count = 5 }: { count?: number }) {
	return (
		<div className="space-y-4">
			{Array.from({ length: count }, (_, i) => (
				<BetSkeleton key={`bet-skeleton-${Math.random()}-${i}`} />
			))}
		</div>
	);
}

export function EmptyBetsSkeleton() {
	return (
		<Card>
			<CardContent className="py-8 text-center">
				<Skeleton className="h-5 w-48 mx-auto mb-4" />
				<Skeleton className="h-10 w-32 mx-auto" />
			</CardContent>
		</Card>
	);
}
