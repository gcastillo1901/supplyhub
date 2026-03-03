"use client"

import { useState, useEffect } from "react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RecentSales() {
  const [sales, setSales] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/sales')
      .then(res => res.json())
      .then(setSales)
  }, [])

  const getPaymentMethodLabel = (method: string) => {
    if (method === "cash") return "Efectivo"
    if (method === "transfer") return "Transferencia"
    return "Crédito"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ventas Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {sales.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay ventas recientes</p>
        ) : (
          <div className="space-y-3">
            {sales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{sale.customer?.name || "Cliente"}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(sale.saleDate)}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <Badge variant="secondary" className="text-xs">
                    {getPaymentMethodLabel(sale.paymentMethod)}
                  </Badge>
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {formatCurrency(Number(sale.total))}
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
