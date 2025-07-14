"use client";

import { History, LogOut, Menu, TrendingUp, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { NavbarSkeleton } from "@/components/skeletons";

export function Navbar() {
	const { user, isAuthenticated, logout, isLoading } = useAuth();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	if (isLoading) {
		return <NavbarSkeleton />;
	}

	return (
		<nav className="bg-white shadow-sm border-b">
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<TrendingUp className="h-6 w-6 text-blue-600" />
						<span className="text-xl font-bold text-gray-900">
							Sport Betting
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-6">
						{isAuthenticated ? (
							<>
								<Link
									href="/"
									className="text-gray-700 hover:text-blue-600 transition-colors"
								>
									Eventos
								</Link>
								<Link
									href="/bets"
									className="text-gray-700 hover:text-blue-600 transition-colors"
								>
									Mis Apuestas
								</Link>

								{/* User Menu */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="flex items-center space-x-2"
										>
											<Avatar className="h-8 w-8">
												<AvatarFallback>
													{user?.fullName?.charAt(0) || "U"}
												</AvatarFallback>
											</Avatar>
											<div className="text-left">
												<div className="text-sm font-medium">
													{user?.fullName}
												</div>
												<div className="text-xs text-green-600">
													{formatCurrency(user?.balance || 0)}
												</div>
											</div>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-56">
										<DropdownMenuItem asChild>
											<Link href="/profile" className="flex items-center">
												<User className="mr-2 h-4 w-4" />
												Perfil
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link href="/bets" className="flex items-center">
												<History className="mr-2 h-4 w-4" />
												Historial de Apuestas
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() => logout.mutate()}
											className="flex items-center text-red-600"
										>
											<LogOut className="mr-2 h-4 w-4" />
											Cerrar Sesión
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</>
						) : (
							<div className="flex items-center space-x-4">
								<Button variant="ghost" asChild>
									<Link href="/login">Iniciar Sesión</Link>
								</Button>
								<Button asChild>
									<Link href="/register">Registrarse</Link>
								</Button>
							</div>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							{isMobileMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMobileMenuOpen && (
					<div className="md:hidden py-4 border-t">
						{isAuthenticated ? (
							<div className="space-y-4">
								<div className="flex items-center space-x-3 px-2">
									<Avatar className="h-10 w-10">
										<AvatarFallback>
											{user?.fullName?.charAt(0) || "U"}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-medium">{user?.fullName}</div>
										<div className="text-sm text-green-600">
											{formatCurrency(user?.balance || 0)}
										</div>
									</div>
								</div>
								<div className="space-y-2">
									<Link
										href="/"
										className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										Eventos
									</Link>
									<Link
										href="/bets"
										className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										Mis Apuestas
									</Link>
									<Link
										href="/profile"
										className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										Perfil
									</Link>
									<button
										type="button"
										onClick={(
											_e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
										) => {
											logout.mutate();
											setIsMobileMenuOpen(false);
										}}
										className="block w-full text-left px-2 py-2 text-red-600 hover:bg-gray-100 rounded"
									>
										Cerrar Sesión
									</button>
								</div>
							</div>
						) : (
							<div className="space-y-2">
								<Link
									href="/login"
									className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Iniciar Sesión
								</Link>
								<Link
									href="/register"
									className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Registrarse
								</Link>
							</div>
						)}
					</div>
				)}
			</div>
		</nav>
	);
}
