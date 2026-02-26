"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import type { Product } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { ProductTable } from "@/components/inventory/product-table"
import { ProductForm } from "@/components/inventory/product-form"

export default function InventarioPage() {
  const categories = useAppStore((s) => s.categories)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  const handleEdit = (product: Product) => {
    setEditProduct(product)
    setFormOpen(true)
  }

  const handleClose = () => {
    setFormOpen(false)
    setEditProduct(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">Inventario</h1>
          <p className="text-muted-foreground">Gestiona los productos de la ferreteria</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="size-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o codigo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-50">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorias</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ProductTable search={search} categoryFilter={categoryFilter} onEdit={handleEdit} />

      <ProductForm open={formOpen} onClose={handleClose} editProduct={editProduct} />
    </div>
  )
}
