"use client";

import { Calendar, Clock, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { mockBets } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function BetsPage() {
	const { user, isAuthenticated } = useAuth();
	const [bets, setBets] = useState(mockBets);

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar />
				<div className="container mx-auto px-4 py-16 text-center">
					<h1 className="text-2xl font-bold mb-4">Acceso Requerido</h1>
					<p className="text-gray-600 mb-8">
						Debes iniciar sesión para ver tu historial de apuestas.
					</p>
					<Button asChild>
						<a href="/login">Iniciar Sesión</a>
					</Button>
				</div>
			</div>
		);
	}

	const activeBets = bets.filter((bet) => bet.status === "Active");
	const completedBets = bets.filter((bet) => bet.status !== "Active");

	const handleCancelBet = (betId: number) => {
		setBets((prev) => prev.filter((bet) => bet.id !== betId));
	};

	const getBadgeVariant = (status: string) => {
		switch (status) {
			case "Active":
				return "default";
			case "Won":
				return "default";
			case "Lost":
				return "destructive";
			case "Cancelled":
				return "secondary";
			default:
				return "secondary";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "Active":
				return "Activa";
			case "Won":
				return "Ganada";
			case "Lost":
				return "Perdida";
			case "Cancelled":
				return "Cancelada";
			default:
				return status;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />

			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Mis Apuestas
					</h1>
					<p className="text-gray-600">
						Gestiona y revisa tu historial de apuestas
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Apuestas Activas
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{activeBets.length}</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Apostado
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{formatCurrency(bets.reduce((sum, bet) => sum + bet.amount, 0))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Ganancia Potencial
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">
								{formatCurrency(
									activeBets.reduce((sum, bet) => sum + bet.potentialWin, 0),
								)}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Tasa de Éxito
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-600">
								{completedBets.length > 0
									? `${Math.round((completedBets.filter((bet) => bet.status === "Won").length / completedBets.length) * 100)}%`
									: "0%"}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Bets Tabs */}
				<Tabs defaultValue="active" className="space-y-6">
					<TabsList>
						<TabsTrigger value="active">
							Apuestas Activas ({activeBets.length})
						</TabsTrigger>
						<TabsTrigger value="history">
							Historial ({completedBets.length})
						</TabsTrigger>
					</TabsList>

					<TabsContent value="active" className="space-y-4">
						{activeBets.length === 0 ? (
							<Card>
								<CardContent className="py-8 text-center">
									<p className="text-gray-500">No tienes apuestas activas</p>
									<Button className="mt-4" asChild>
										<a href="/">Ver Eventos</a>
									</Button>
								</CardContent>
							</Card>
						) : (
							activeBets.map((bet) => (
								<Card key={bet.id}>
									<CardHeader>
										<div className="flex justify-between items-start">
											<div>
												<CardTitle className="text-lg">
													{bet.eventName}
												</CardTitle>
												<div className="flex items-center text-sm text-gray-500 mt-1">
													<Calendar className="h-4 w-4 mr-1" />
													{formatDate(bet.eventDate)}
													<Clock className="h-4 w-4 ml-3 mr-1" />
													{bet.timeUntilEvent}
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<Badge variant={getBadgeVariant(bet.status)}>
													{getStatusText(bet.status)}
												</Badge>
												{bet.canBeCancelled && (
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleCancelBet(bet.id)}
													>
														<X className="h-4 w-4" />
													</Button>
												)}
											</div>
										</div>
									</CardHeader>

									<CardContent>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
											<div>
												<p className="text-sm text-gray-500">
													Equipo Seleccionado
												</p>
												<p className="font-semibold">{bet.selectedTeam}</p>
											</div>
											<div>
												<p className="text-sm text-gray-500">Monto Apostado</p>
												<p className="font-semibold">
													{formatCurrency(bet.amount)}
												</p>
											</div>
											<div>
												<p className="text-sm text-gray-500">Cuota</p>
												<p className="font-semibold">{bet.odds.toFixed(2)}</p>
											</div>
											<div>
												<p className="text-sm text-gray-500">
													Ganancia Potencial
												</p>
												<p className="font-semibold text-green-600">
													{formatCurrency(bet.potentialWin)}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</TabsContent>

					<TabsContent value="history" className="space-y-4">
						{completedBets.length === 0 ? (
							<Card>
								<CardContent className="py-8 text-center">
									<p className="text-gray-500">
										No tienes historial de apuestas
									</p>
								</CardContent>
							</Card>
						) : (
							completedBets.map((bet) => (
								<Card key={bet.id}>
									<CardHeader>
										<div className="flex justify-between items-start">
											<div>
												<CardTitle className="text-lg">
													{bet.eventName}
												</CardTitle>
												<div className="flex items-center text-sm text-gray-500 mt-1">
													<Calendar className="h-4 w-4 mr-1" />
													{formatDate(bet.createdAt)}
												</div>
											</div>
											<Badge variant={getBadgeVariant(bet.status)}>
												{getStatusText(bet.status)}
											</Badge>
										</div>
									</CardHeader>

									<CardContent>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
											<div>
												<p className="text-sm text-gray-500">
													Equipo Seleccionado
												</p>
												<p className="font-semibold">{bet.selectedTeam}</p>
											</div>
											<div>
												<p className="text-sm text-gray-500">Monto Apostado</p>
												<p className="font-semibold">
													{formatCurrency(bet.amount)}
												</p>
											</div>
											<div>
												<p className="text-sm text-gray-500">Cuota</p>
												<p className="font-semibold">{bet.odds.toFixed(2)}</p>
											</div>
											<div>
												<p className="text-sm text-gray-500">
													{bet.status === "Won"
														? "Ganancia"
														: "Ganancia Potencial"}
												</p>
												<p
													className={`font-semibold ${bet.status === "Won" ? "text-green-600" : "text-gray-600"}`}
												>
													{formatCurrency(bet.potentialWin)}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
