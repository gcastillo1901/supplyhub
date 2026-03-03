"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Percent, Tag, Truck, Save, Plus } from "lucide-react"
import { toast } from "sonner"

export default function ConfiguracionPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [businessName, setBusinessName] = useState("Ferretería")
  const [taxRate, setTaxRate] = useState("15")
  const [saved, setSaved] = useState(false)

  const [catDialogOpen, setCatDialogOpen] = useState(false)
  const [catName, setCatName] = useState("")
  const [catDesc, setCatDesc] = useState("")

  const [supDialogOpen, setSupDialogOpen] = useState(false)
  const [supName, setSupName] = useState("")
  const [supIdent, setSupIdent] = useState("")
  const [supPhone, setSupPhone] = useState("")
  const [supEmail, setSupEmail] = useState("")
  const [supAddress, setSupAddress] = useState("")

  const loadData = () => {
    fetch('/api/categories').then(res => res.json()).then(setCategories)
    fetch('/api/suppliers').then(res => res.json()).then(setSuppliers)
    fetch('/api/products').then(res => res.json()).then(setProducts)
  }

  useEffect(() => {
    loadData()
  }, [])

  function handleSaveConfig() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleSaveCategory() {
    if (!catName.trim()) return
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: catName.trim(), description: catDesc.trim() })
    })
    toast.success("Categoría creada")
    setCatName("")
    setCatDesc("")
    setCatDialogOpen(false)
    loadData()
  }

  async function handleSaveSupplier() {
    if (!supName.trim()) return
    await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: supName.trim(),
        identification: supIdent.trim(),
        phone: supPhone.trim(),
        email: supEmail.trim(),
        address: supAddress.trim()
      })
    })
    toast.success("Proveedor creado")
    setSupName("")
    setSupIdent("")
    setSupPhone("")
    setSupEmail("")
    setSupAddress("")
    setSupDialogOpen(false)
    loadData()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Configuracion</h1>
        <p className="text-muted-foreground">Parametros del negocio, categorias y proveedores</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
        </TabsList>

        {/* General config */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="size-5" />
                Datos del Negocio
              </CardTitle>
              <CardDescription>Configure el nombre del negocio y la tasa de impuestos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid max-w-lg gap-6">
                <div className="space-y-2">
                  <Label>Nombre del Negocio</Label>
                  <Input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Nombre de la ferreteria"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Percent className="size-3" />
                    Tasa de IVA (%)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Porcentaje de impuesto sobre ventas aplicado automaticamente</p>
                </div>
                <Button onClick={handleSaveConfig} className="w-fit">
                  <Save className="mr-2 size-4" />
                  {saved ? "Guardado" : "Guardar Cambios"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="size-5" />
                    Categorias de Productos
                  </CardTitle>
                  <CardDescription>{categories.length} categorias registradas</CardDescription>
                </div>
                <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 size-4" />
                      Nueva Categoria
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nueva Categoria</DialogTitle>
                      <DialogDescription>Ingrese los datos de la nueva categoria</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Nombre *</Label>
                        <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="Nombre de la categoria" />
                      </div>
                      <div className="space-y-2">
                        <Label>Descripcion</Label>
                        <Textarea value={catDesc} onChange={(e) => setCatDesc(e.target.value)} placeholder="Descripcion breve" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCatDialogOpen(false)}>Cancelar</Button>
                      <Button onClick={handleSaveCategory}>Crear</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripcion</TableHead>
                    <TableHead className="text-right">Productos</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat) => {
                    const productCount = products.filter((p) => p.categoryId === cat.id).length
                    return (
                      <TableRow key={cat.id}>
                        <TableCell className="font-medium text-foreground">{cat.name}</TableCell>
                        <TableCell className="text-muted-foreground">{cat.description}</TableCell>
                        <TableCell className="text-right text-foreground">{productCount}</TableCell>
                        <TableCell className="text-right"></TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suppliers */}
        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="size-5" />
                    Proveedores
                  </CardTitle>
                  <CardDescription>{suppliers.length} proveedores registrados</CardDescription>
                </div>
                <Dialog open={supDialogOpen} onOpenChange={setSupDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 size-4" />
                      Nuevo Proveedor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Nuevo Proveedor</DialogTitle>
                      <DialogDescription>Ingrese los datos del nuevo proveedor</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Nombre Empresa *</Label>
                          <Input value={supName} onChange={(e) => setSupName(e.target.value)} placeholder="Nombre" />
                        </div>
                        <div className="space-y-2">
                          <Label>RUC *</Label>
                          <Input value={supIdent} onChange={(e) => setSupIdent(e.target.value)} placeholder="RUC del proveedor" />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Telefono</Label>
                          <Input value={supPhone} onChange={(e) => setSupPhone(e.target.value)} placeholder="0000-0000" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input type="email" value={supEmail} onChange={(e) => setSupEmail(e.target.value)} placeholder="correo@ejemplo.com" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Direccion</Label>
                        <Input value={supAddress} onChange={(e) => setSupAddress(e.target.value)} placeholder="Direccion completa" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSupDialogOpen(false)}>Cancelar</Button>
                      <Button onClick={handleSaveSupplier}>Crear</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>RUC</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Telefono</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Productos</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((sup) => {
                    const productCount = products.filter((p) => p.supplierId === sup.id).length
                    return (
                      <TableRow key={sup.id}>
                        <TableCell className="font-medium text-foreground">{sup.name}</TableCell>
                        <TableCell className="text-muted-foreground">{sup.identification}</TableCell>
                        <TableCell className="text-muted-foreground">-</TableCell>
                        <TableCell className="text-muted-foreground">{sup.phone}</TableCell>
                        <TableCell className="text-muted-foreground">{sup.email}</TableCell>
                        <TableCell className="text-right text-foreground">{productCount}</TableCell>
                        <TableCell className="text-right"></TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
