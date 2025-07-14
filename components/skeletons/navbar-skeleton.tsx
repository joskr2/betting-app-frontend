import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function NavbarSkeleton() {
	return (
		<nav className="bg-white shadow-sm border-b">
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex items-center space-x-2">
						<TrendingUp className="h-6 w-6 text-blue-600" />
						<span className="text-xl font-bold text-gray-900">
							Sport Betting
						</span>
					</div>

					{/* Desktop Navigation Skeleton */}
					<div className="hidden md:flex items-center space-x-6">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-20" />

						{/* User Menu Skeleton */}
						<div className="flex items-center space-x-2">
							<Skeleton className="h-8 w-8 rounded-full" />
							<div className="text-left">
								<Skeleton className="h-4 w-24 mb-1" />
								<Skeleton className="h-3 w-16" />
							</div>
						</div>
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<Skeleton className="h-8 w-8" />
					</div>
				</div>
			</div>
		</nav>
	);
}
