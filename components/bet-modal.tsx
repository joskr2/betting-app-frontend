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
import { useBetPreview, useCreateBet } from "@/hooks/use-bets"
import type { EventData } from "@/types/api"

interface BetModalProps {
  event: EventData & { selectedTeam: string }
  onClose: () => void
  onBetPlaced: () => void
}

export function BetModal({ event, onClose, onBetPlaced }: BetModalProps) {
  const { user } = useAuth()
  const [amount, setAmount] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const betPreview = useBetPreview()
  const createBet = useCreateBet()

  const betAmount = Number.parseFloat(amount) || 0
  const selectedOdds = event.selectedTeam === event.teamA ? event.teamAOdds : event.teamBOdds
  const potentialWin = betAmount * selectedOdds
  const profit = potentialWin - betAmount

  const handlePreview = async () => {
    if (betAmount <= 0) return

    await betPreview.mutateAsync({
      event_id: event.id,
      selected_team: event.selectedTeam,
      amount: betAmount,
    })
    setShowPreview(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (betAmount <= 0) return
    if (betAmount > (user?.balance || 0)) return
    if (betAmount > 10000) return

    try {
      await createBet.mutateAsync({
        event_id: event.id,
        selected_team: event.selectedTeam,
        amount: betAmount,
      })
      onBetPlaced()
    } catch (err) {
      // Error is handled by the mutation
    }
  }

  const isValid = betAmount > 0 && 
                 betAmount <= (user?.balance || 0) && 
                 betAmount <= 10000 &&
                 event.canPlaceBets

  const getErrorMessage = () => {
    if (betAmount <= 0) return "El monto debe ser mayor a 0"
    if (betAmount > (user?.balance || 0)) return "Saldo insuficiente"
    if (betAmount > 10000) return "El monto máximo por apuesta es $10,000"
    if (!event.canPlaceBets) return "Este evento ya no acepta apuestas"
    return ""
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
          {(createBet.error || betPreview.error || getErrorMessage()) && (
            <Alert variant="destructive">
              <AlertDescription>
                {createBet.error?.message || betPreview.error?.message || getErrorMessage()}
              </AlertDescription>
            </Alert>
          )}

          {/* Preview Data */}
          {betPreview.data && showPreview && (
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h4 className="font-medium text-yellow-800 mb-2">Vista Previa de Apuesta</h4>
              <div className="text-sm space-y-1">
                <p>Nivel de riesgo: <span className="font-medium">{betPreview.data.riskLevel}</span></p>
                {betPreview.data.warnings && betPreview.data.warnings.length > 0 && (
                  <div>
                    <p className="font-medium text-yellow-700">Advertencias:</p>
                    <ul className="list-disc list-inside text-yellow-600">
                      {betPreview.data.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
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
                <p className="font-medium text-blue-600">{selectedOdds.toFixed(2)}</p>
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
                  <span className="font-medium">{selectedOdds.toFixed(2)}</span>
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
            {!showPreview && betAmount > 0 ? (
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handlePreview}
                disabled={betPreview.isPending || !isValid}
                className="flex-1"
              >
                {betPreview.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Vista Previa
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={createBet.isPending || !isValid} 
                className="flex-1"
              >
                {createBet.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar Apuesta
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
