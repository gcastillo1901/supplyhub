"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/utils"
import { DollarSign, ShoppingCart, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SummaryCards() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setStats)
  }, [])

  if (!stats) return null

  const cards = [
    {
      title: "Ventas Hoy",
      value: stats.todaySalesCount.toString(),
      description: "transacciones completadas",
      icon: ShoppingCart,
    },
    {
      title: "Ingresos Hoy",
      value: formatCurrency(stats.todayRevenue),
      description: "en ventas del dia",
      icon: DollarSign,
    },
    {
      title: "Stock Bajo",
      value: stats.lowStockCount.toString(),
      description: "productos por reabastecer",
      icon: AlertTriangle,
      alert: stats.lowStockCount > 0,
    },
    {
      title: "Estado Caja",
      value: stats.cashRegister ? formatCurrency(stats.cashRegister.openingAmount) : "Cerrada",
      description: stats.cashRegister ? "caja abierta" : "sin caja activa",
      icon: DollarSign,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon
              className={`size-4 ${card.alert ? "text-destructive" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
