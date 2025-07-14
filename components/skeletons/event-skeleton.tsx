import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EventSkeleton() {
	return (
		<Card className="hover:shadow-lg transition-shadow">
			<CardHeader>
				<div className="flex justify-between items-start">
					<div className="flex-1">
						<Skeleton className="h-6 w-3/4 mb-2" />
						<div className="flex items-center space-x-4">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-20" />
						</div>
					</div>
					<Skeleton className="h-6 w-16" />
				</div>
			</CardHeader>

			<CardContent>
				<div className="space-y-4">
					{/* Teams and Odds */}
					<div className="grid grid-cols-2 gap-4">
						<div className="text-center p-4 bg-blue-50 rounded-lg">
							<Skeleton className="h-5 w-20 mx-auto mb-2" />
							<Skeleton className="h-8 w-12 mx-auto mb-2" />
							<Skeleton className="h-8 w-full" />
						</div>

						<div className="text-center p-4 bg-red-50 rounded-lg">
							<Skeleton className="h-5 w-20 mx-auto mb-2" />
							<Skeleton className="h-8 w-12 mx-auto mb-2" />
							<Skeleton className="h-8 w-full" />
						</div>
					</div>

					{/* Event Stats */}
					<div className="flex justify-between text-sm text-gray-500 pt-2 border-t">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-20" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function EventListSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{Array.from({ length: count }, (_, i) => (
				<EventSkeleton key={`event-skeleton-${Math.random()}-${i}`} />
			))}
		</div>
	);
}
