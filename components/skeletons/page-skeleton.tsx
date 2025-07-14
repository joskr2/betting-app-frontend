import { Skeleton } from "@/components/ui/skeleton";

export function PageHeaderSkeleton() {
	return (
		<div className="mb-8">
			<Skeleton className="h-9 w-64 mb-2" />
			<Skeleton className="h-5 w-96" />
		</div>
	);
}

export function PageLoadingSkeleton() {
	return (
		<div className="container mx-auto px-4 py-8">
			<PageHeaderSkeleton />
			<div className="space-y-6">
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-48 w-full" />
				<Skeleton className="h-64 w-full" />
			</div>
		</div>
	);
}
