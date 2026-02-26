"use client"

import { useAppStore } from "@/lib/store"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"
import { Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import type { Purchase } from "@/lib/types"

export default function ComprasPage() {
  const purchases = useAppStore((s) => s.purchases)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)

  const sorted = [...purchases].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">Compras</h1>
          <p className="text-muted-foreground">Historial de compras a proveedores</p>
        </div>
        <Button asChild>
          <Link href="/compras/nueva">
            <Plus className="size-4 mr-2" />
            Nueva Compra
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead className="hidden md:table-cell">Productos</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-15"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length > 0 ? (
              sorted.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="text-sm">{formatDate(purchase.createdAt)}</TableCell>
                  <TableCell className="font-medium">{purchase.supplierName}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {purchase.details.length} item{purchase.details.length === 1 ? "" : "s"}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(purchase.total)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => setSelectedPurchase(purchase)}
                    >
                      <Eye className="size-3.5" />
                      <span className="sr-only">Ver detalle</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No hay compras registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedPurchase} onOpenChange={() => setSelectedPurchase(null)}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Detalle de Compra</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Proveedor</div>
                <div className="font-medium">{selectedPurchase.supplierName}</div>
                <div className="text-muted-foreground">Fecha</div>
                <div>{formatDate(selectedPurchase.createdAt)}</div>
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
                    {selectedPurchase.details.map((d) => (
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
                  <span>{formatCurrency(selectedPurchase.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA</span>
                  <span>{formatCurrency(selectedPurchase.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(selectedPurchase.total)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
