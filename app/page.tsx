"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, TrendingUp, Users } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { BetModal } from "@/components/bet-modal";
import { mockEvents } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";
import { formatCurrency, formatDate, getTimeUntilEvent } from "@/lib/utils";

interface SelectedEvent {
  id: number;
  name: string;
  teamA: string;
  teamB: string;
  teamAOdds: number;
  teamBOdds: number;
  eventDate: string;
  status: string;
  canPlaceBets: boolean;
  timeUntilEvent: string;
  totalBetsAmount: number;
  totalBetsCount: number;
  createdAt: string;
  selectedTeam: string;
  odds: number;
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(
    null
  );
  const [events, setEvents] = useState(mockEvents);

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
                {formatCurrency(user?.balance || 0)}
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
              <div className="text-2xl font-bold">3</div>
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
                {formatCurrency(450)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(event.eventDate)}
                      <Clock className="h-4 w-4 ml-3 mr-1" />
                      {getTimeUntilEvent(event.eventDate)}
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
                        {event.teamA}
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mt-1">
                        {event.teamAOdds.toFixed(2)}
                      </div>
                      <Button
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() =>
                          setSelectedEvent({
                            ...event,
                            selectedTeam: event.teamA,
                            odds: event.teamAOdds,
                          })
                        }
                        disabled={!event.canPlaceBets}
                      >
                        Apostar
                      </Button>
                    </div>

                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="font-semibold text-gray-900">
                        {event.teamB}
                      </div>
                      <div className="text-2xl font-bold text-red-600 mt-1">
                        {event.teamBOdds.toFixed(2)}
                      </div>
                      <Button
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() =>
                          setSelectedEvent({
                            ...event,
                            selectedTeam: event.teamB,
                            odds: event.teamBOdds,
                          })
                        }
                        disabled={!event.canPlaceBets}
                      >
                        Apostar
                      </Button>
                    </div>
                  </div>

                  {/* Event Stats */}
                  <div className="flex justify-between text-sm text-gray-500 pt-2 border-t">
                    <span>
                      Total apostado: {formatCurrency(event.totalBetsAmount)}
                    </span>
                    <span>{event.totalBetsCount} apuestas</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
