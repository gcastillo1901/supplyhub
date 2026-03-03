"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Trash2, ShoppingCart, Search } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface CartItem {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export default function NuevaCompraPage() {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [supplierId, setSupplierId] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchProduct, setSearchProduct] = useState("")
  const [selectedProductId, setSelectedProductId] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [unitPrice, setUnitPrice] = useState("")

  useEffect(() => {
    fetch('/api/suppliers').then(res => res.json()).then(setSuppliers)
    fetch('/api/products').then(res => res.json()).then(setProducts)
  }, [])

  const selectedSupplier = suppliers.find((s) => s.id === Number(supplierId))

  const filteredProducts = useMemo(() => {
    if (!searchProduct.trim()) return products
    const q = searchProduct.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q)
    )
  }, [products, searchProduct])

  const subtotal = cart.reduce((a, item) => a + item.subtotal, 0)
  const total = subtotal

  function handleAddToCart() {
    const product = products.find((p) => p.id === Number(selectedProductId))
    if (!product) return
    const qty = Number.parseInt(quantity)
    const price = Number.parseFloat(unitPrice) || Number(product.purchasePrice)
    if (qty <= 0) return

    const existing = cart.find((item) => item.productId === product.id)
    if (existing) {
      setCart(cart.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + qty, subtotal: (item.quantity + qty) * price, unitPrice: price }
          : item
      ))
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        quantity: qty,
        unitPrice: price,
        subtotal: qty * price,
      }])
    }
    setSelectedProductId("")
    setQuantity("1")
    setUnitPrice("")
    setSearchProduct("")
  }

  function handleRemoveFromCart(productId: number) {
    setCart(cart.filter((item) => item.productId !== productId))
  }

  async function handleSubmit() {
    if (!supplierId || cart.length === 0) return
    await fetch('/api/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supplierId: Number(supplierId),
        total,
        details: cart
      })
    })
    toast.success("Compra registrada exitosamente")
    router.push("/compras")
  }

  function handleSelectProduct(productId: string) {
    setSelectedProductId(productId)
    const product = products.find((p) => p.id === Number(productId))
    if (product) {
      setUnitPrice(product.purchasePrice.toString())
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/compras">
            <ArrowLeft className="size-4" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Nueva Compra</h1>
          <p className="text-muted-foreground">Registrar compra a proveedor</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Proveedor</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proveedor..." />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agregar Productos</CardTitle>
              <CardDescription>Busque y agregue productos a la orden de compra</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-5">
                <div className="sm:col-span-2 space-y-2">
                  <Label>Producto</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar producto..."
                      value={searchProduct}
                      onChange={(e) => setSearchProduct(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  {searchProduct.trim() && filteredProducts.length > 0 && !selectedProductId && (
                    <div className="max-h-40 overflow-y-auto rounded-md border bg-popover p-1">
                      {filteredProducts.slice(0, 8).map((p) => (
                        <button
                          key={p.id}
                          className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                          onClick={() => {
                            handleSelectProduct(p.id.toString())
                            setSearchProduct(p.name)
                          }}
                        >
                          <span>{p.code} - {p.name}</span>
                          <span className="text-muted-foreground">{formatCurrency(Number(p.purchasePrice))}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Precio Unitario</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    placeholder="Precio compra"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddToCart} disabled={!selectedProductId} className="w-full">
                    <Plus className="mr-1 size-4" />
                    Agregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalle de Compra</CardTitle>
              <CardDescription>{cart.length} producto(s) en la orden</CardDescription>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">Agregue productos a la orden de compra</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-center">Cantidad</TableHead>
                      <TableHead className="text-right">Precio Unit.</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead className="w--12.5"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium text-foreground">{item.productName}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right font-mono font-medium">{formatCurrency(item.subtotal)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveFromCart(item.productId)} className="text-destructive hover:text-destructive">
                            <Trash2 className="size-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="size-5" />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Proveedor</span>
                  <span className="font-medium text-foreground">{selectedSupplier?.name ?? "No seleccionado"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Productos</span>
                  <span className="text-foreground">{cart.length}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono text-foreground">{formatCurrency(subtotal)}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                disabled={!supplierId || cart.length === 0}
                onClick={handleSubmit}
              >
                Registrar Compra
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
