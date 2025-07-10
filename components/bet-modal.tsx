"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Calculator } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { formatCurrency } from "@/lib/utils"

interface BetModalProps {
  event: any
  onClose: () => void
  onBetPlaced: () => void
}

export function BetModal({ event, onClose, onBetPlaced }: BetModalProps) {
  const { user } = useAuth()
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const betAmount = Number.parseFloat(amount) || 0
  const potentialWin = betAmount * event.odds
  const profit = potentialWin - betAmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (betAmount <= 0) {
      setError("El monto debe ser mayor a 0")
      setIsLoading(false)
      return
    }

    if (betAmount > (user?.balance || 0)) {
      setError("Saldo insuficiente")
      setIsLoading(false)
      return
    }

    if (betAmount > 10000) {
      setError("El monto máximo por apuesta es $10,000")
      setIsLoading(false)
      return
    }

    try {
      // Simular llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Aquí harías la llamada real a la API
      // await placeBet({
      //   eventId: event.id,
      //   selectedTeam: event.selectedTeam,
      //   amount: betAmount
      // })

      onBetPlaced()
    } catch (err) {
      setError("Error al realizar la apuesta. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Realizar Apuesta</DialogTitle>
          <DialogDescription>
            {event.name} - {event.selectedTeam}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Event Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Evento:</span>
                <p className="font-medium">{event.name}</p>
              </div>
              <div>
                <span className="text-gray-500">Equipo:</span>
                <p className="font-medium">{event.selectedTeam}</p>
              </div>
              <div>
                <span className="text-gray-500">Cuota:</span>
                <p className="font-medium text-blue-600">{event.odds.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-gray-500">Tu balance:</span>
                <p className="font-medium text-green-600">{formatCurrency(user?.balance || 0)}</p>
              </div>
            </div>
          </div>

          {/* Bet Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Monto a apostar</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max="10000"
              step="0.01"
              required
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[50, 100, 250, 500].map((quickAmount) => (
              <Button
                key={quickAmount}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(quickAmount.toString())}
                disabled={quickAmount > (user?.balance || 0)}
              >
                ${quickAmount}
              </Button>
            ))}
          </div>

          {/* Calculation */}
          {betAmount > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calculator className="h-4 w-4 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">Cálculo de Apuesta</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Monto apostado:</span>
                  <span className="font-medium">{formatCurrency(betAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cuota:</span>
                  <span className="font-medium">{event.odds.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span>Ganancia potencial:</span>
                  <span className="font-bold text-green-600">{formatCurrency(potentialWin)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ganancia neta:</span>
                  <span className="font-bold text-blue-600">{formatCurrency(profit)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || betAmount <= 0} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar Apuesta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
