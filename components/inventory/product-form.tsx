"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import type { Product } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface ProductFormProps {
  open: boolean
  onClose: () => void
  editProduct?: Product | null
}

export function ProductForm({ open, onClose, editProduct }: Readonly<ProductFormProps>) {
  const categories = useAppStore((s) => s.categories)
  const suppliers = useAppStore((s) => s.suppliers)
  const addProduct = useAppStore((s) => s.addProduct)
  const updateProduct = useAppStore((s) => s.updateProduct)

  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    categoryId: "",
    supplierId: "",
    purchasePrice: "",
    salePrice: "",
    stock: "",
    minStock: "",
    unit: "unidad",
  })

  useEffect(() => {
    if (editProduct) {
      setForm({
        code: editProduct.code,
        name: editProduct.name,
        description: editProduct.description,
        categoryId: editProduct.categoryId,
        supplierId: editProduct.supplierId,
        purchasePrice: editProduct.purchasePrice.toString(),
        salePrice: editProduct.salePrice.toString(),
        stock: editProduct.stock.toString(),
        minStock: editProduct.minStock.toString(),
        unit: editProduct.unit,
      })
    } else {
      setForm({
        code: "",
        name: "",
        description: "",
        categoryId: categories[0]?.id || "",
        supplierId: suppliers[0]?.id || "",
        purchasePrice: "",
        salePrice: "",
        stock: "",
        minStock: "",
        unit: "unidad",
      })
    }
  }, [editProduct, open, categories, suppliers])

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.code || !form.name || !form.categoryId || !form.supplierId) {
      toast.error("Completa los campos requeridos")
      return
    }

    const data = {
      code: form.code,
      name: form.name,
      description: form.description,
      categoryId: form.categoryId,
      supplierId: form.supplierId,
      purchasePrice: Number.parseFloat(form.purchasePrice) || 0,
      salePrice: Number.parseFloat(form.salePrice) || 0,
      stock: Number.parseInt(form.stock) || 0,
      minStock: Number.parseInt(form.minStock) || 0,
      unit: form.unit,
    }

    if (editProduct) {
      updateProduct(editProduct.id, data)
      toast.success("Producto actualizado")
    } else {
      addProduct(data)
      toast.success("Producto creado")
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{editProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Codigo *</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="HM-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unidad</Label>
              <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                <SelectTrigger id="unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unidad">Unidad</SelectItem>
                  <SelectItem value="libra">Libra</SelectItem>
                  <SelectItem value="galon">Galon</SelectItem>
                  <SelectItem value="metro">Metro</SelectItem>
                  <SelectItem value="pie">Pie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nombre del producto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripcion</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descripcion breve"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm({ ...form, categoryId: v })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Proveedor *</Label>
              <Select
                value={form.supplierId}
                onValueChange={(v) => setForm({ ...form, supplierId: v })}
              >
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Precio Compra</Label>
              <Input
                id="purchasePrice"
                type="number"
                step="0.01"
                value={form.purchasePrice}
                onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salePrice">Precio Venta</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                value={form.salePrice}
                onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Actual</Label>
              <Input
                id="stock"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">Stock Minimo</Label>
              <Input
                id="minStock"
                type="number"
                value={form.minStock}
                onChange={(e) => setForm({ ...form, minStock: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editProduct ? "Guardar Cambios" : "Crear Producto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
