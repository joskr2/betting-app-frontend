"use client";

import { Calendar, Clock, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { BetModal } from "@/components/bet-modal";
import { Navbar } from "@/components/navbar";
import { EventListSkeleton, StatsGridSkeleton } from "@/components/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBettingDashboard } from "@/hooks/use-bets";
import { useEvents } from "@/hooks/use-events";
import { useAuth } from "@/lib/auth";
import { formatCurrency, formatDate, getTimeUntilEvent } from "@/lib/utils";
import type { EventData } from "@/types/api";

interface SelectedEvent extends EventData {
	selectedTeam: string;
	odds: number;
}

export default function HomePage() {
	const { user, isAuthenticated } = useAuth();
	const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(
		null,
	);

	// Fetch real data
	const {
		data: events,
		isLoading: eventsLoading,
		error: eventsError,
	} = useEvents({ limit: 10 });
	const { data: dashboard, isLoading: dashboardLoading } =
		useBettingDashboard();

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
				<Navbar />
				<div className="container mx-auto px-4 py-16">
					<div className="text-center max-w-2xl mx-auto">
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							Bienvenido a Sport Betting
						</h1>
						<p className="text-xl text-gray-600 mb-8">
							La mejor plataforma de apuestas deportivas. Inicia sesión para
							comenzar a apostar.
						</p>
						<div className="space-x-4">
							<Button size="lg" asChild>
								<a href="/login">Iniciar Sesión</a>
							</Button>
							<Button variant="outline" size="lg" asChild>
								<a href="/register">Registrarse</a>
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />

			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Eventos Deportivos
					</h1>
					<p className="text-gray-600">
						Descubre los mejores eventos deportivos y realiza tus apuestas
					</p>
				</div>

				{/* User Stats */}
				{dashboardLoading ? (
					<div className="mb-8">
						<StatsGridSkeleton />
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Balance Actual
								</CardTitle>
								<TrendingUp className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-green-600">
									{formatCurrency(user?.balance || dashboard?.user.balance || 0)}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Apuestas Activas
								</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{dashboard?.statistics.activeBets || 0}
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
								<div className="text-2xl font-bold text-blue-600">
									{formatCurrency(dashboard?.statistics.currentPotentialWin || 0)}
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Events Grid */}
				{eventsLoading ? (
					<EventListSkeleton />
				) : eventsError ? (
					<Card>
						<CardContent className="py-8 text-center">
							<p className="text-gray-500 mb-4">Error al cargar eventos</p>
							<Button onClick={() => window.location.reload()}>
								Reintentar
							</Button>
						</CardContent>
					</Card>
				) : !events || events.length === 0 ? (
					<Card>
						<CardContent className="py-8 text-center">
							<p className="text-gray-500">
								No hay eventos disponibles en este momento
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{events.map((event) => (
							<Card
								key={event.id}
								className="hover:shadow-lg transition-shadow"
							>
								<CardHeader>
									<div className="flex justify-between items-start">
										<div>
											<CardTitle className="text-lg">{event.name}</CardTitle>
											<div className="flex items-center text-sm text-gray-500 mt-1">
												<Calendar className="h-4 w-4 mr-1" />
												{formatDate(event.event_date)}
												<Clock className="h-4 w-4 ml-3 mr-1" />
												{event.time_until_event || getTimeUntilEvent(event.event_date)}
											</div>
										</div>
										<Badge
											variant={
												event.status === "Active" ? "default" : "secondary"
											}
										>
											{event.status === "Active" ? "Activo" : "Finalizado"}
										</Badge>
									</div>
								</CardHeader>

								<CardContent>
									<div className="space-y-4">
										{/* Teams and Odds */}
										<div className="grid grid-cols-2 gap-4">
											<div className="text-center p-4 bg-blue-50 rounded-lg">
												<div className="font-semibold text-gray-900">
													{event.team_a}
												</div>
												<div className="text-2xl font-bold text-blue-600 mt-1">
										{event.team_a_odds ? event.team_a_odds.toFixed(2) : 'N/A'}
									</div>
												<Button
													size="sm"
													className="mt-2 w-full"
													onClick={() =>
														setSelectedEvent({
															...event,
															selectedTeam: event.team_a,
															odds: event.team_a_odds,
														})
													}
													disabled={!event.can_place_bets}
												>
													Apostar
												</Button>
											</div>

											<div className="text-center p-4 bg-red-50 rounded-lg">
												<div className="font-semibold text-gray-900">
													{event.team_b}
												</div>
												<div className="text-2xl font-bold text-red-600 mt-1">
										{event.team_b_odds ? event.team_b_odds.toFixed(2) : 'N/A'}
									</div>
												<Button
													size="sm"
													className="mt-2 w-full"
													onClick={() =>
														setSelectedEvent({
															...event,
															selectedTeam: event.team_b,
															odds: event.team_b_odds,
														})
													}
													disabled={!event.can_place_bets}
												>
													Apostar
												</Button>
											</div>
										</div>

										{/* Event Stats */}
										<div className="flex justify-between text-sm text-gray-500 pt-2 border-t">
											<span>
												Total apostado: {formatCurrency(event.total_bets_amount || 0)}
											</span>
											<span>{event.total_bets_count || 0} apuestas</span>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>

			{/* Bet Modal */}
			{selectedEvent && (
				<BetModal
					event={selectedEvent}
					onClose={() => setSelectedEvent(null)}
					onBetPlaced={() => {
						setSelectedEvent(null);
						// Aquí podrías actualizar el balance del usuario
					}}
				/>
			)}
		</div>
	);
}
