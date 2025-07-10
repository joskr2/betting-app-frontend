import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function getTimeUntilEvent(eventDate: string): string {
  const now = new Date()
  const event = new Date(eventDate)
  const diffInMs = event.getTime() - now.getTime()

  if (diffInMs <= 0) {
    return "Finalizado"
  }

  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (diffInDays > 0) {
    return `${diffInDays} día${diffInDays > 1 ? "s" : ""}`
  } else if (diffInHours > 0) {
    return `${diffInHours} hora${diffInHours > 1 ? "s" : ""}`
  } else {
    const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""}`
  }
}
