"use client"

import { useState, useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { Download, TrendingUp, TrendingDown, DollarSign, Package } from "lucide-react"

const COLORS = ["oklch(0.65 0.17 55)", "oklch(0.55 0.12 180)", "oklch(0.45 0.08 230)", "oklch(0.75 0.15 85)", "oklch(0.6 0.16 35)"]

function calculateSalesByCategory(
  sales: any[],
  products: any[],
  categories: any[]
) {
  const catMap: Record<string, number> = {}
  for (const sale of sales) {
    for (const detail of sale.details) {
      const product = products.find((p) => p.id === detail.productId)
      if (!product) continue
      const cat = categories.find((c) => c.id === product.categoryId)
      const catName = cat?.name ?? "Sin categoria"
      catMap[catName] = (catMap[catName] || 0) + detail.subtotal
    }
  }
  return Object.entries(catMap)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value)
}

function calculateTopProducts(sales: any[]) {
  const prodMap: Record<string, { name: string; quantity: number; revenue: number }> = {}
  for (const sale of sales) {
    for (const detail of sale.details) {
      if (!prodMap[detail.productId]) {
        prodMap[detail.productId] = { name: detail.productName, quantity: 0, revenue: 0 }
      }
      prodMap[detail.productId].quantity += detail.quantity
      prodMap[detail.productId].revenue += detail.subtotal
    }
  }
  return Object.values(prodMap).sort((a, b) => b.revenue - a.revenue).slice(0, 10)
}

function calculateTopCustomers(sales: any[]) {
  const custMap: Record<string, { name: string; count: number; total: number }> = {}
  for (const sale of sales) {
    const key = sale.customerName
    if (!custMap[key]) custMap[key] = { name: key, count: 0, total: 0 }
    custMap[key].count += 1
    custMap[key].total += sale.total
  }
  return Object.values(custMap).sort((a, b) => b.total - a.total).slice(0, 10)
}

function calculatePaymentMethods(sales: any[]) {
  const methods: Record<string, number> = { cash: 0, transfer: 0, credit: 0 }
  for (const sale of sales) {
    methods[sale.paymentMethod] += sale.total
  }
  const labels: Record<string, string> = { cash: "Efectivo", transfer: "Transferencia", credit: "Credito" }
  return Object.entries(methods)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({ name: labels[key], value: Math.round(value * 100) / 100 }))
}

export default function ReportesPage() {
  const { sales, purchases, products, categories } = useAppStore()
  const [period, setPeriod] = useState("7")

  const cutoff = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - Number.parseInt(period))
    return d
  }, [period])

  const filteredSales = useMemo(
    () => sales.filter((s) => s.status === "completed" && new Date(s.createdAt) >= cutoff),
    [sales, cutoff]
  )

  const filteredPurchases = useMemo(
    () => purchases.filter((p) => new Date(p.createdAt) >= cutoff),
    [purchases, cutoff]
  )

  const totalSales = filteredSales.reduce((a, s) => a + s.total, 0)
  const totalPurchases = filteredPurchases.reduce((a, p) => a + p.total, 0)
  const profit = totalSales - totalPurchases

  // Sales by day
  const salesByDay = useMemo(() => {
    const days: Record<string, number> = {}
    for (let i = Number.parseInt(period) - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString("es-NI", { month: "short", day: "numeric" })
      days[key] = 0
    }
    filteredSales.forEach((s) => {
      const key = new Date(s.createdAt).toLocaleDateString("es-NI", { month: "short", day: "numeric" })
      if (days[key] !== undefined) days[key] += s.total
    })
    return Object.entries(days).map(([name, total]) => ({ name, total: Math.round(total * 100) / 100 }))
  }, [filteredSales, period])

  // Sales by category
  const salesByCategory = useMemo(
    () => calculateSalesByCategory(filteredSales, products, categories),
    [filteredSales, products, categories]
  )

  // Top products
  const topProducts = useMemo(
    () => calculateTopProducts(filteredSales),
    [filteredSales]
  )

  // Top customers
  const topCustomers = useMemo(
    () => calculateTopCustomers(filteredSales),
    [filteredSales]
  )

  // Payment methods
  const paymentMethods = useMemo(
    () => calculatePaymentMethods(filteredSales),
    [filteredSales]
  )

  function exportCSV() {
    const header = "Fecha,Cliente,Subtotal,IVA,Total,Metodo Pago\n"
    const rows = filteredSales
      .map((s) =>
        `${new Date(s.createdAt).toLocaleDateString("es-NI")},${s.customerName},${s.subtotal},${s.tax},${s.total},${s.paymentMethod}`
      )
      .join("\n")
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reporte-ventas-${period}dias.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reportes</h1>
          <p className="text-muted-foreground">Analisis de ventas, compras y rendimiento del negocio</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-45">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Ultimos 7 dias</SelectItem>
              <SelectItem value="15">Ultimos 15 dias</SelectItem>
              <SelectItem value="30">Ultimos 30 dias</SelectItem>
              <SelectItem value="90">Ultimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="mr-2 size-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
            <TrendingUp className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-muted-foreground">{filteredSales.length} ventas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Compras</CardTitle>
            <TrendingDown className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(totalPurchases)}</div>
            <p className="text-xs text-muted-foreground">{filteredPurchases.length} compras</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ganancia Bruta</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {formatCurrency(profit)}
            </div>
            <p className="text-xs text-muted-foreground">Ventas - Compras</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {filteredSales.length > 0 ? formatCurrency(totalSales / filteredSales.length) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">Por venta</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Ventas por Dia</TabsTrigger>
          <TabsTrigger value="categories">Por Categoria</TabsTrigger>
          <TabsTrigger value="products">Productos Top</TabsTrigger>
          <TabsTrigger value="customers">Clientes Top</TabsTrigger>
        </TabsList>

        {/* Sales by day chart */}
        <TabsContent value="sales">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Ventas por Dia</CardTitle>
                <CardDescription>Total de ventas diarias en el periodo seleccionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-87.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesByDay}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                      <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value: number) => [formatCurrency(value), "Total"]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="total" fill="oklch(0.65 0.17 55)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metodos de Pago</CardTitle>
                <CardDescription>Distribucion por forma de pago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-87.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={paymentMethods} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {paymentMethods.map((method) => (
                          <Cell key={method.name} fill={COLORS[paymentMethods.indexOf(method) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categories chart */}
        <TabsContent value="categories">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ventas por Categoria</CardTitle>
                <CardDescription>Distribucion del ingreso por categoria de producto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-87.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={salesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                        {salesByCategory.map((cat) => (
                          <Cell key={cat.name} fill={COLORS[salesByCategory.indexOf(cat) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Detalle por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Ventas</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesByCategory.map((cat) => (
                      <TableRow key={cat.name}>
                        <TableCell className="font-medium text-foreground">{cat.name}</TableCell>
                        <TableCell className="text-right font-mono text-foreground">{formatCurrency(cat.value)}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {totalSales > 0 ? ((cat.value / totalSales) * 100).toFixed(1) : 0}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Top products */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Productos Mas Vendidos</CardTitle>
              <CardDescription>Top 10 productos por ingreso generado</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Ingreso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((p, i) => (
                    <TableRow key={p.name}>
                      <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                      <TableCell className="text-right text-foreground">{p.quantity}</TableCell>
                      <TableCell className="text-right font-mono font-medium text-foreground">{formatCurrency(p.revenue)}</TableCell>
                    </TableRow>
                  ))}
                  {topProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                        No hay datos para el periodo seleccionado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top customers */}
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Mejores Clientes</CardTitle>
              <CardDescription>Top 10 clientes por monto total de compras</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Compras</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCustomers.map((c, i) => (
                    <TableRow key={c.name}>
                      <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                      <TableCell className="text-right text-foreground">{c.count}</TableCell>
                      <TableCell className="text-right font-mono font-medium text-foreground">{formatCurrency(c.total)}</TableCell>
                    </TableRow>
                  ))}
                  {topCustomers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                        No hay datos para el periodo seleccionado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
