"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function LowStockList() {
  const products = useAppStore((s) => s.products)
  const categories = useAppStore((s) => s.categories)

  const lowStock = products
    .filter((p) => p.stock <= p.minStock)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 8)

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || "Sin categoria"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Productos con Stock Bajo</CardTitle>
      </CardHeader>
      <CardContent>
        {lowStock.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay productos con stock bajo
          </p>
        ) : (
          <div className="space-y-3">
            {lowStock.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getCategoryName(product.categoryId)}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <Badge
                    variant={product.stock === 0 ? "destructive" : "secondary"}
                    className={
                      product.stock === 0
                        ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        : "bg-chart-4/20 text-foreground hover:bg-chart-4/30"
                    }
                  >
                    {product.stock} / {product.minStock}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
