"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import type { PaymentMethod } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Plus, Minus, Trash2, ArrowLeft, ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface CartItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
  maxStock: number
}

export default function NuevaVentaPage() {
  const router = useRouter()
  const products = useAppStore((s) => s.products)
  const customers = useAppStore((s) => s.customers)
  const config = useAppStore((s) => s.config)
  const createSale = useAppStore((s) => s.createSale)

  const [search, setSearch] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerId, setCustomerId] = useState("cust-1")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")

  const filteredProducts = search.length >= 1
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.code.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 8)
    : []

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const existing = cart.find((item) => item.productId === productId)
    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.error("Stock insuficiente")
        return
      }
      setCart(
        cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
            : item
        )
      )
    } else {
      if (product.stock <= 0) {
        toast.error("Producto sin stock")
        return
      }
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.salePrice,
          subtotal: product.salePrice,
          maxStock: product.stock,
        },
      ])
    }
    setSearch("")
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.productId !== productId) return item
          const newQty = item.quantity + delta
          if (newQty <= 0) return null
          if (newQty > item.maxStock) {
            toast.error("Stock insuficiente")
            return item
          }
          return { ...item, quantity: newQty, subtotal: newQty * item.unitPrice }
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId))
  }

  const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0)
  const tax = subtotal * (config.taxRate / 100)
  const total = subtotal + tax

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      toast.error("Agrega productos a la venta")
      return
    }

    const customer = customers.find((c) => c.id === customerId)

    createSale({
      customerId,
      customerName: customer?.name || "Contado",
      details: cart.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
      paymentMethod,
      taxRate: config.taxRate,
    })

    toast.success("Venta completada exitosamente")
    router.push("/ventas")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/ventas">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">Nueva Venta</h1>
          <p className="text-muted-foreground">Punto de venta</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Product search and cart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar producto por nombre o codigo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Search results */}
          {filteredProducts.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      className="flex w-full items-center justify-between p-3 text-left hover:bg-accent transition-colors"
                      onClick={() => addToCart(product.id)}
                    >
                      <div>
                        <div className="font-medium text-sm">{product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {product.code} - Stock: {product.stock}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {formatCurrency(product.salePrice)}
                        </span>
                        <Plus className="size-4 text-primary" />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cart table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingCart className="size-4" />
                Productos en Venta ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-center w-35">Cantidad</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="w-12.5"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Busca y agrega productos
                      </TableCell>
                    </TableRow>
                  ) : (
                    cart.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium text-sm">{item.productName}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-7"
                              onClick={() => updateQuantity(item.productId, -1)}
                            >
                              <Minus className="size-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-7"
                              onClick={() => updateQuantity(item.productId, 1)}
                            >
                              <Plus className="size-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-sm">
                          {formatCurrency(item.subtotal)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-destructive hover:text-destructive"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sale summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Resumen de Venta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Metodo de Pago</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="transfer">Transferencia</SelectItem>
                    <SelectItem value="credit">Credito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA ({config.taxRate}%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCompleteSale}
                disabled={cart.length === 0}
              >
                Completar Venta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
