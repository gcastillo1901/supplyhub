"use client"

import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

export function SalesChart() {
  const sales = useAppStore((s) => s.sales)

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date
  })

  const data = last7Days.map((date) => {
    const dayStr = date.toDateString()
    const daySales = sales.filter(
      (s) => new Date(s.createdAt).toDateString() === dayStr && s.status === "completed"
    )
    return {
      day: date.toLocaleDateString("es-NI", { weekday: "short" }),
      total: daySales.reduce((acc, s) => acc + s.total, 0),
      count: daySales.length,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ventas - Ultimos 7 dias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-62.5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="day"
                stroke="oklch(0.5 0.02 60)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="oklch(0.5 0.02 60)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `L${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Total"]}
                labelStyle={{ color: "oklch(0.18 0.02 60)" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid oklch(0.9 0.01 80)",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="total"
                fill="oklch(0.65 0.17 55)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
