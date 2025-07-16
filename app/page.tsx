"use client";

import { useState } from "react";
import { Calendar, Clock, TrendingUp, Users } from "lucide-react";
import { BetModal } from "@/components/bet-modal";
import { FeaturesCarousel } from "@/components/features-carousel";
import { Navbar } from "@/components/navbar";
import { EventListSkeleton, StatsGridSkeleton } from "@/components/skeletons";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBettingDashboard } from "@/hooks/use-bets";
import { useEvents } from "@/hooks/use-events";
import { useAuth } from "@/lib/auth";
import { mockEvents } from "@/lib/mock-data";
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
			<div className="min-h-screen bg-white">
				<Navbar />

				{/* Hero Section */}
				<section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
					{/* Background Pattern */}
					<div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] opacity-10" />
					<div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />

					<div className="relative container mx-auto px-4 py-20">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							{/* Left Column - Content */}
							<div className="space-y-8">
								<div className="space-y-4">
									<h1 className="text-5xl md:text-6xl font-bold leading-tight">
										Apuesta en los
										<span className="text-yellow-400"> mejores </span>
										deportes
									</h1>
									<p className="text-xl text-blue-100 leading-relaxed">
										La plataforma más confiable para apostar en tus deportes
										favoritos. Cuotas competitivas, pagos rápidos y la mejor
										experiencia de usuario.
									</p>
								</div>

								<div className="flex flex-col sm:flex-row gap-4">
									<Button
										size="lg"
										className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-8 py-4 text-lg"
										asChild
									>
										<a href="/register">Comenzar Ahora</a>
									</Button>
									<Button
										variant="outline"
										size="lg"
										className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg bg-transparent"
										asChild
									>
										<a href="/login">Iniciar Sesión</a>
									</Button>
								</div>

								{/* Stats */}
								<div className="grid grid-cols-3 gap-8 pt-8">
									<div className="text-center">
										<div className="text-3xl font-bold text-yellow-400">
											1M+
										</div>
										<div className="text-blue-100">Usuarios</div>
									</div>
									<div className="text-center">
										<div className="text-3xl font-bold text-yellow-400">
											500+
										</div>
										<div className="text-blue-100">Eventos</div>
									</div>
									<div className="text-center">
										<div className="text-3xl font-bold text-yellow-400">
											24/7
										</div>
										<div className="text-blue-100">Soporte</div>
									</div>
								</div>
							</div>

							{/* Right Column - Image/Illustration */}
							<div className="relative">
								<div className="relative z-10">
									<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
										<div className="space-y-6">
											<div className="text-center">
												<div className="text-2xl font-bold mb-2">
													¡Bono de Bienvenida!
												</div>
												<div className="text-yellow-400 text-4xl font-bold">
													$1,000
												</div>
												<div className="text-blue-100">
													Para nuevos usuarios
												</div>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div className="bg-white/10 rounded-lg p-4 text-center">
													<div className="text-2xl">⚽</div>
													<div className="text-sm">Fútbol</div>
												</div>
												<div className="bg-white/10 rounded-lg p-4 text-center">
													<div className="text-2xl">🏀</div>
													<div className="text-sm">Baloncesto</div>
												</div>
												<div className="bg-white/10 rounded-lg p-4 text-center">
													<div className="text-2xl">🏈</div>
													<div className="text-sm">NFL</div>
												</div>
												<div className="bg-white/10 rounded-lg p-4 text-center">
													<div className="text-2xl">🎾</div>
													<div className="text-sm">Tenis</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Floating Elements */}
								<div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse" />
								<div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-400 rounded-full opacity-20 animate-pulse" />
							</div>
						</div>
					</div>
				</section>

				{/* Features Carousel Section */}
				<section className="py-20 bg-gray-50">
					<div className="container mx-auto px-4">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold text-gray-900 mb-4">
								¿Por qué elegir Sport Betting?
							</h2>
							<p className="text-xl text-gray-600 max-w-3xl mx-auto">
								Descubre todas las ventajas que te ofrecemos para hacer de tu
								experiencia de apuestas algo único
							</p>
						</div>

						<FeaturesCarousel />
					</div>
				</section>

				{/* Live Events Preview */}
				<section className="py-20 bg-white">
					<div className="container mx-auto px-4">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold text-gray-900 mb-4">
								Eventos en Vivo
							</h2>
							<p className="text-xl text-gray-600">
								Los mejores eventos deportivos te esperan
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{mockEvents.slice(0, 3).map((event: (typeof mockEvents)[0]) => (
								<Card
									key={event.id}
									className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg"
								>
									<CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
										<CardTitle className="text-lg">{event.name}</CardTitle>
										<p className="text-blue-100 text-sm">
											{formatDate(event.eventDate)}
										</p>
									</CardHeader>
									<CardContent className="p-6">
										<div className="grid grid-cols-2 gap-4">
											<div className="text-center p-4 bg-blue-50 rounded-lg">
												<div className="font-semibold text-gray-900">
													{event.teamA}
												</div>
												<div className="text-2xl font-bold text-blue-600 mt-2">
													{event.teamAOdds.toFixed(2)}
												</div>
											</div>
											<div className="text-center p-4 bg-red-50 rounded-lg">
												<div className="font-semibold text-gray-900">
													{event.teamB}
												</div>
												<div className="text-2xl font-bold text-red-600 mt-2">
													{event.teamBOdds.toFixed(2)}
												</div>
											</div>
										</div>
										<div className="mt-4 text-center">
											<Badge className="bg-green-100 text-green-800 border-green-300">
												{event.totalBetsCount} apuestas activas
											</Badge>
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						<div className="text-center mt-12">
							<Button
								size="lg"
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg"
								asChild
							>
								<a href="/register">Ver Todos los Eventos</a>
							</Button>
						</div>
					</div>
				</section>

				{/* Testimonials Section */}
				<section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
					<div className="container mx-auto px-4">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold mb-4">
								Lo que dicen nuestros usuarios
							</h2>
							<p className="text-xl text-gray-300">
								Miles de apostadores confían en nosotros
							</p>
						</div>

						<TestimonialsCarousel />
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-20 bg-gradient-to-r from-yellow-400 to-orange-500">
					<div className="container mx-auto px-4 text-center">
						<div className="max-w-4xl mx-auto">
							<h2 className="text-5xl font-bold text-gray-900 mb-6">
								¿Listo para comenzar a ganar?
							</h2>
							<p className="text-xl text-gray-800 mb-8">
								Únete a miles de usuarios que ya están ganando con Sport
								Betting. Regístrate ahora y recibe tu bono de bienvenida.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button
									size="lg"
									className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg"
									asChild
								>
									<a href="/register">Crear Cuenta Gratis</a>
								</Button>
								<Button
									variant="outline"
									size="lg"
									className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-4 text-lg bg-transparent"
									asChild
								>
									<a href="/login">Ya tengo cuenta</a>
								</Button>
							</div>
						</div>
					</div>
				</section>

				{/* Footer */}
				<footer className="bg-gray-900 text-white py-12">
					<div className="container mx-auto px-4">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
							<div>
								<div className="flex items-center space-x-2 mb-4">
									<TrendingUp className="h-6 w-6 text-yellow-400" />
									<span className="text-xl font-bold">Sport Betting</span>
								</div>
								<p className="text-gray-400">
									La plataforma más confiable para apuestas deportivas online.
								</p>
							</div>
							<div>
								<h3 className="font-semibold mb-4">Deportes</h3>
								<ul className="space-y-2 text-gray-400">
									<li>Fútbol</li>
									<li>Baloncesto</li>
									<li>Tenis</li>
									<li>NFL</li>
								</ul>
							</div>
							<div>
								<h3 className="font-semibold mb-4">Soporte</h3>
								<ul className="space-y-2 text-gray-400">
									<li>Centro de Ayuda</li>
									<li>Chat en Vivo</li>
									<li>Términos y Condiciones</li>
									<li>Política de Privacidad</li>
								</ul>
							</div>
							<div>
								<h3 className="font-semibold mb-4">Contacto</h3>
								<ul className="space-y-2 text-gray-400">
									<li>support@sportbetting.com</li>
									<li>+1 (555) 123-4567</li>
									<li>Disponible 24/7</li>
								</ul>
							</div>
						</div>
						<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
							<p>&copy; 2024 Sport Betting. Todos los derechos reservados.</p>
						</div>
					</div>
				</footer>
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
									{formatCurrency(
										user?.balance || dashboard?.user.balance || 0,
									)}
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
									{formatCurrency(
										dashboard?.statistics.currentPotentialWin || 0,
									)}
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
												{event.time_until_event ||
													getTimeUntilEvent(event.event_date)}
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
													{event.team_a_odds
														? event.team_a_odds.toFixed(2)
														: "N/A"}
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
													{event.team_b_odds
														? event.team_b_odds.toFixed(2)
														: "N/A"}
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
												Total apostado:{" "}
												{formatCurrency(event.total_bets_amount || 0)}
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
