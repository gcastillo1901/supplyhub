"use client"

import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { DollarSign, ShoppingCart, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SummaryCards() {
  const sales = useAppStore((s) => s.sales)
  const products = useAppStore((s) => s.products)
  const cashRegister = useAppStore((s) => s.cashRegister)

  const today = new Date().toDateString()
  const todaySales = sales.filter(
    (s) => new Date(s.createdAt).toDateString() === today && s.status === "completed"
  )
  const todayRevenue = todaySales.reduce((acc, s) => acc + s.total, 0)
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock)

  const cards = [
    {
      title: "Ventas Hoy",
      value: todaySales.length.toString(),
      description: "transacciones completadas",
      icon: ShoppingCart,
    },
    {
      title: "Ingresos Hoy",
      value: formatCurrency(todayRevenue),
      description: "en ventas del dia",
      icon: DollarSign,
    },
    {
      title: "Stock Bajo",
      value: lowStockProducts.length.toString(),
      description: "productos por reabastecer",
      icon: AlertTriangle,
      alert: lowStockProducts.length > 0,
    },
    {
      title: "Estado Caja",
      value: cashRegister ? formatCurrency(cashRegister.expectedAmount) : "Cerrada",
      description: cashRegister ? "caja abierta" : "sin caja activa",
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
