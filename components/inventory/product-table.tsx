"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Product {
  id: number
  code: string
  name: string
  categoryId: number
  purchasePrice: number
  salePrice: number
  stock: number
  minimumStock: number
  category: { id: number; name: string }
}

interface ProductTableProps {
  search: string
  categoryFilter: string
  onEdit: (product: any) => void
}

export function ProductTable({ search, categoryFilter, onEdit }: Readonly<ProductTableProps>) {
  const [products, setProducts] = useState<Product[]>([])
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
  }, [])

  const filtered = products.filter((p) => {
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === "all" || p.categoryId === Number(categoryFilter)
    return matchSearch && matchCategory
  })

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Producto eliminado")
      setDeleteId(null)
    }
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Codigo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden md:table-cell">Categoria</TableHead>
              <TableHead className="text-right">P. Compra</TableHead>
              <TableHead className="text-right">P. Venta</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="w-25 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No se encontraron productos
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-xs">{product.code}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {product.category?.name || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(Number(product.purchasePrice))}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(Number(product.salePrice))}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={product.stock <= product.minimumStock ? "destructive" : "secondary"}
                      className={
                        product.stock <= product.minimumStock
                          ? "bg-destructive/10 text-destructive"
                          : ""
                      }
                    >
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => onEdit(product)}
                      >
                        <Pencil className="size-3.5" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(product.id)}
                      >
                        <Trash2 className="size-3.5" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. El producto sera eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
