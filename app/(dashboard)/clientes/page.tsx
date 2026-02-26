"use client"
import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { formatCurrency, formatDateShort } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plus, Search, Pencil, Trash2, Phone, Mail } from "lucide-react"
import type { Customer, CustomerType } from "@/lib/types"

export default function ClientesPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAppStore()
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const [name, setName] = useState("")
  const [identification, setIdentification] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [customerType, setCustomerType] = useState<CustomerType>("retail")
  const [creditLimit, setCreditLimit] = useState("0")

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.identification.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    const matchesType = filterType === "all" || c.type === filterType
    return matchesSearch && matchesType
  })

  function resetForm() {
    setName("")
    setIdentification("")
    setPhone("")
    setEmail("")
    setAddress("")
    setCustomerType("retail")
    setCreditLimit("0")
    setEditingCustomer(null)
  }

  function handleOpenCreate() {
    resetForm()
    setDialogOpen(true)
  }

  function handleOpenEdit(customer: Customer) {
    setEditingCustomer(customer)
    setName(customer.name)
    setIdentification(customer.identification)
    setPhone(customer.phone)
    setEmail(customer.email)
    setAddress(customer.address)
    setCustomerType(customer.type)
    setCreditLimit(customer.creditLimit.toString())
    setDialogOpen(true)
  }

  function handleSave() {
    if (!name.trim()) return
    const data = {
      name: name.trim(),
      identification: identification.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      type: customerType,
      creditLimit: Number.parseFloat(creditLimit) || 0,
    }
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data)
    } else {
      addCustomer(data)
    }
    setDialogOpen(false)
    resetForm()
  }

  function handleDelete(id: string) {
    if (id === "cust-1") return // Protect default customer
    deleteCustomer(id)
  }

  const typeLabel: Record<CustomerType, string> = {
    retail: "Minorista",
    wholesale: "Mayorista",
    credit: "Credito",
  }

  const typeColor: Record<CustomerType, string> = {
    retail: "bg-blue-50 text-blue-700 border-blue-200",
    wholesale: "bg-amber-50 text-amber-700 border-amber-200",
    credit: "bg-purple-50 text-purple-700 border-purple-200",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gestion de clientes y control de creditos</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate}>
              <Plus className="mr-2 size-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCustomer ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
              <DialogDescription>
                {editingCustomer ? "Modifique los datos del cliente" : "Complete los datos del nuevo cliente"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nombre *</Label>
                  <Input placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Identificacion</Label>
                  <Input placeholder="RUC o Cédula" value={identification} onChange={(e) => setIdentification(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Telefono</Label>
                  <Input placeholder="0000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Direccion</Label>
                <Input placeholder="Direccion completa" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tipo de Cliente</Label>
                  <Select value={customerType} onValueChange={(v) => setCustomerType(v as CustomerType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Minorista</SelectItem>
                      <SelectItem value="wholesale">Mayorista</SelectItem>
                      <SelectItem value="credit">Credito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Limite de Credito (C$)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="100"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm() }}>Cancelar</Button>
              <Button onClick={handleSave}>{editingCustomer ? "Guardar" : "Crear Cliente"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Con Credito</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {customers.filter((c) => c.type === "credit").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo Pendiente Total</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(customers.reduce((a, c) => a + c.balance, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, ID o telefono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="retail">Minorista</SelectItem>
                <SelectItem value="wholesale">Mayorista</SelectItem>
                <SelectItem value="credit">Credito</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>{filtered.length} clientes encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Identificacion</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Limite Credito</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead>Desde</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{c.identification || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      {c.phone && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="size-3" /> {c.phone}
                        </span>
                      )}
                      {c.email && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="size-3" /> {c.email}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={typeColor[c.type]}>
                      {typeLabel[c.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-foreground">{c.creditLimit > 0 ? formatCurrency(c.creditLimit) : "-"}</TableCell>
                  <TableCell className={`text-right font-mono font-medium ${c.balance > 0 ? "text-red-600" : "text-foreground"}`}>
                    {c.balance > 0 ? formatCurrency(c.balance) : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDateShort(c.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(c)}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      {c.id !== "cust-1" && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="size-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    No se encontraron clientes
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
