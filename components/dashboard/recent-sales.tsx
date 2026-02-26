"use client"

import { useAppStore } from "@/lib/store"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RecentSales() {
  const sales = useAppStore((s) => s.sales)

  const recent = [...sales]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const getPaymentMethodLabel = (method: string) => {
    if (method === "cash") return "Efectivo"
    if (method === "transfer") return "Transferencia"
    return "Credito"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ventas Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay ventas recientes</p>
        ) : (
          <div className="space-y-3">
            {recent.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{sale.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(sale.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <Badge variant="secondary" className="text-xs">
                    {getPaymentMethodLabel(sale.paymentMethod)}
                  </Badge>
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {formatCurrency(sale.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
