"use client";

import {
	Award,
	Calendar,
	DollarSign,
	Target,
	TrendingUp,
	User,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { mockBets } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ProfilePage() {
	const { user, isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar />
				<div className="container mx-auto px-4 py-16 text-center">
					<h1 className="text-2xl font-bold mb-4">Acceso Requerido</h1>
					<p className="text-gray-600 mb-8">
						Debes iniciar sesión para ver tu perfil.
					</p>
					<Button asChild>
						<a href="/login">Iniciar Sesión</a>
					</Button>
				</div>
			</div>
		);
	}

	const wonBets = mockBets.filter((bet) => bet.status === "Won").length;
	const totalBets = mockBets.length;
	const winRate = totalBets > 0 ? (wonBets / totalBets) * 100 : 0;
	const totalWinnings = mockBets
		.filter((bet) => bet.status === "Won")
		.reduce((sum, bet) => sum + bet.potentialWin, 0);

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />

			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
					<p className="text-gray-600">
						Información de tu cuenta y estadísticas de apuestas
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Profile Info */}
					<div className="lg:col-span-1">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<User className="h-5 w-5 mr-2" />
									Información Personal
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<span className="text-sm text-gray-500">Nombre Completo</span>
									<p className="font-medium">{user?.fullName}</p>
								</div>
								<div>
									<span className="text-sm text-gray-500">Email</span>
									<p className="font-medium">{user?.email}</p>
								</div>
								<div>
									<span className="text-sm text-gray-500">Miembro desde</span>
									<p className="font-medium">
										{formatDate(user?.createdAt || "")}
									</p>
								</div>
								<div>
									<span className="text-sm text-gray-500">Balance Actual</span>
									<p className="text-2xl font-bold text-green-600">
										{formatCurrency(user?.balance || 0)}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Statistics */}
					<div className="lg:col-span-2">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total de Apuestas
									</CardTitle>
									<Target className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{totalBets}</div>
									<p className="text-xs text-muted-foreground">
										Apuestas realizadas
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Tasa de Éxito
									</CardTitle>
									<Award className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{winRate.toFixed(1)}%
									</div>
									<p className="text-xs text-muted-foreground">
										{wonBets} de {totalBets} apuestas ganadas
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Apostado
									</CardTitle>
									<DollarSign className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{formatCurrency(user?.totalBetAmount || 0)}
									</div>
									<p className="text-xs text-muted-foreground">
										Monto total en apuestas
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Ganancias Totales
									</CardTitle>
									<TrendingUp className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold text-green-600">
										{formatCurrency(totalWinnings)}
									</div>
									<p className="text-xs text-muted-foreground">
										Ganancias acumuladas
									</p>
								</CardContent>
							</Card>
						</div>

						{/* Recent Activity */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Calendar className="h-5 w-5 mr-2" />
									Actividad Reciente
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{mockBets.slice(0, 5).map((bet) => (
										<div
											key={bet.id}
											className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
										>
											<div className="flex-1">
												<p className="font-medium text-sm">{bet.eventName}</p>
												<p className="text-xs text-gray-500">
													{bet.selectedTeam} • {formatCurrency(bet.amount)}
												</p>
											</div>
											<div className="text-right">
												<Badge
													variant={
														bet.status === "Won"
															? "default"
															: bet.status === "Lost"
																? "destructive"
																: "secondary"
													}
												>
													{bet.status === "Won"
														? "Ganada"
														: bet.status === "Lost"
															? "Perdida"
															: bet.status === "Active"
																? "Activa"
																: "Cancelada"}
												</Badge>
												<p className="text-xs text-gray-500 mt-1">
													{formatDate(bet.createdAt)}
												</p>
											</div>
										</div>
									))}
								</div>
								<div className="mt-4 text-center">
									<Button variant="outline" asChild>
										<a href="/bets">Ver Todas las Apuestas</a>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
