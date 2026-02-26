"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Percent, Plus, Pencil, Trash2, Tag, Truck, Save } from "lucide-react"
import type { Category, Supplier } from "@/lib/types"
//import { set } from "date-fns"

export default function ConfiguracionPage() {
  const {
    config, updateConfig,
    categories, addCategory, updateCategory, deleteCategory,
    suppliers, addSupplier, updateSupplier, deleteSupplier,
    products,
  } = useAppStore()

  // Business config state
  const [businessName, setBusinessName] = useState(config.businessName)
  const [taxRate, setTaxRate] = useState(config.taxRate.toString())
  const [saved, setSaved] = useState(false)

  // Category dialog state
  const [catDialogOpen, setCatDialogOpen] = useState(false)
  const [editingCat, setEditingCat] = useState<Category | null>(null)
  const [catName, setCatName] = useState("")
  const [catDesc, setCatDesc] = useState("")

  // Supplier dialog state
  const [supDialogOpen, setSupDialogOpen] = useState(false)
  const [editingSup, setEditingSup] = useState<Supplier | null>(null)
  const [supName, setSupName] = useState("")
  const [supIdent, setSupIdent] = useState("")
  const [supContact, setSupContact] = useState("")
  const [supPhone, setSupPhone] = useState("")
  const [supEmail, setSupEmail] = useState("")
  const [supAddress, setSupAddress] = useState("")

  function handleSaveConfig() {
    updateConfig({
      businessName: businessName.trim(),
      taxRate: Number.parseFloat(taxRate) || 15,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Category handlers
  function handleOpenCreateCat() {
    setEditingCat(null)
    setCatName("")
    setCatDesc("")
    setCatDialogOpen(true)
  }

  function handleOpenEditCat(cat: Category) {
    setEditingCat(cat)
    setCatName(cat.name)
    setCatDesc(cat.description)
    setCatDialogOpen(true)
  }

  function handleSaveCat() {
    if (!catName.trim()) return
    if (editingCat) {
      updateCategory(editingCat.id, { name: catName.trim(), description: catDesc.trim() })
    } else {
      addCategory({ name: catName.trim(), description: catDesc.trim() })
    }
    setCatDialogOpen(false)
  }

  function handleDeleteCat(id: string) {
    const hasProducts = products.some((p) => p.categoryId === id)
    if (hasProducts) {
      alert("No se puede eliminar una categoria que tiene productos asociados.")
      return
    }
    deleteCategory(id)
  }

  // Supplier handlers
  function handleOpenCreateSup() {
    setEditingSup(null)
    setSupName("")
    setSupIdent("")
    setSupContact("")
    setSupPhone("")
    setSupEmail("")
    setSupAddress("")
    setSupDialogOpen(true)
  }

  function handleOpenEditSup(sup: Supplier) {
    setEditingSup(sup)
    setSupName(sup.name)
    setSupIdent(sup.identification)
    setSupContact(sup.contact)
    setSupPhone(sup.phone)
    setSupEmail(sup.email)
    setSupAddress(sup.address)
    setSupDialogOpen(true)
  }

  function handleSaveSup() {
    if (!supName.trim()) return
    const data = {
      name: supName.trim(),
      identification: supIdent.trim(),
      contact: supContact.trim(),
      phone: supPhone.trim(),
      email: supEmail.trim(),
      address: supAddress.trim(),
    }
    if (editingSup) {
      updateSupplier(editingSup.id, data)
    } else {
      addSupplier(data)
    }
    setSupDialogOpen(false)
  }

  function handleDeleteSup(id: string) {
    const hasProducts = products.some((p) => p.supplierId === id)
    if (hasProducts) {
      alert("No se puede eliminar un proveedor que tiene productos asociados.")
      return
    }
    deleteSupplier(id)
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
                    <Button onClick={handleOpenCreateCat}>
                      <Plus className="mr-2 size-4" />
                      Nueva Categoria
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingCat ? "Editar Categoria" : "Nueva Categoria"}</DialogTitle>
                      <DialogDescription>
                        {editingCat ? "Modifique los datos de la categoria" : "Ingrese los datos de la nueva categoria"}
                      </DialogDescription>
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
                      <Button onClick={handleSaveCat}>{editingCat ? "Guardar" : "Crear"}</Button>
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
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenEditCat(cat)}>
                              <Pencil className="size-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCat(cat.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </div>
                        </TableCell>
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
                    <Button onClick={handleOpenCreateSup}>
                      <Plus className="mr-2 size-4" />
                      Nuevo Proveedor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>{editingSup ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
                      <DialogDescription>
                        {editingSup ? "Modifique los datos del proveedor" : "Ingrese los datos del nuevo proveedor"}
                      </DialogDescription>
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
                        <div className="space-y-2">
                          <Label>Contacto</Label>
                          <Input value={supContact} onChange={(e) => setSupContact(e.target.value)} placeholder="Persona de contacto" />
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
                      <Button onClick={handleSaveSup}>{editingSup ? "Guardar" : "Crear"}</Button>
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
                        <TableCell className="text-muted-foreground">{sup.contact}</TableCell>
                        <TableCell className="text-muted-foreground">{sup.phone}</TableCell>
                        <TableCell className="text-muted-foreground">{sup.email}</TableCell>
                        <TableCell className="text-right text-foreground">{productCount}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenEditSup(sup)}>
                              <Pencil className="size-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSup(sup.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </div>
                        </TableCell>
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
