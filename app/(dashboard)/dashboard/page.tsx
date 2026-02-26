"use client"

import { SummaryCards } from "@/components/dashboard/summary-cards"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { LowStockList } from "@/components/dashboard/low-stock-list"
import { RecentSales } from "@/components/dashboard/recent-sales"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-balance">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general de la ferreteria
        </p>
      </div>
      <SummaryCards />
      <div className="grid gap-6 lg:grid-cols-2">
        <SalesChart />
        <RecentSales />
      </div>
      <div className="grid gap-6 lg:grid-cols-1">
        <LowStockList />
      </div>
    </div>
  )
}
