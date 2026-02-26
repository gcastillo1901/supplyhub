"use client"

import { useAppStore } from "@/lib/store"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"
import { Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Sale } from "@/lib/types"

export default function VentasPage() {
  const sales = useAppStore((s) => s.sales)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)

  const sorted = [...sales].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const paymentLabel = (m: string) => {
    switch (m) {
      case "cash": return "Efectivo"
      case "transfer": return "Transferencia"
      case "credit": return "Credito"
      default: return m
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">Ventas</h1>
          <p className="text-muted-foreground">Historial de ventas realizadas</p>
        </div>
        <Button asChild>
          <Link href="/ventas/nueva">
            <Plus className="size-4 mr-2" />
            Nueva Venta
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Productos</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-15"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length > 0 ? (
              sorted.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="text-sm">{formatDate(sale.createdAt)}</TableCell>
                  <TableCell className="font-medium">{sale.customerName}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {sale.details.length} item{sale.details.length === 1 ? "" : "s"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {paymentLabel(sale.paymentMethod)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(sale.total)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => setSelectedSale(sale)}
                    >
                      <Eye className="size-3.5" />
                      <span className="sr-only">Ver detalle</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No hay ventas registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedSale} onOpenChange={() => setSelectedSale(null)}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Detalle de Venta</DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Cliente</div>
                <div className="font-medium">{selectedSale.customerName}</div>
                <div className="text-muted-foreground">Fecha</div>
                <div>{formatDate(selectedSale.createdAt)}</div>
                <div className="text-muted-foreground">Metodo de Pago</div>
                <div>{paymentLabel(selectedSale.paymentMethod)}</div>
              </div>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-center">Cant.</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSale.details.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="text-sm">{d.productName}</TableCell>
                        <TableCell className="text-center">{d.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(d.unitPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(d.subtotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="space-y-1 text-sm text-right">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(selectedSale.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA ({selectedSale.taxRate}%)</span>
                  <span>{formatCurrency(selectedSale.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(selectedSale.total)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
