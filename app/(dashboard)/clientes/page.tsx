"use client"
import { useState, useEffect } from "react"
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

interface Customer {
  id: number
  name: string
  identification: string | null
  phone: string | null
  email: string | null
  address: string | null
  customerType: string
  creditLimit: number
  currentBalance: number
  createdAt: string
}

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(setCustomers)
  }, [])

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.identification && c.identification.toLowerCase().includes(search.toLowerCase())) ||
      (c.phone && c.phone.includes(search))
    const matchesType = filterType === "all" || c.customerType === filterType
    return matchesSearch && matchesType
  })

  function handleDelete(id: number) {}

  const typeLabel: Record<string, string> = {
    cash: "Contado",
    credit: "Crédito",
  }

  const typeColor: Record<string, string> = {
    cash: "bg-blue-50 text-blue-700 border-blue-200",
    credit: "bg-purple-50 text-purple-700 border-purple-200",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gestion de clientes y control de creditos</p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          Nuevo Cliente
        </Button>
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
              {customers.filter((c) => c.customerType === "credit").length}
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
              {formatCurrency(customers.reduce((a, c) => a + Number(c.currentBalance), 0))}
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
                    <Badge variant="outline" className={typeColor[c.customerType] || ""}>
                      {typeLabel[c.customerType] || c.customerType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-foreground">{c.creditLimit > 0 ? formatCurrency(Number(c.creditLimit)) : "-"}</TableCell>
                  <TableCell className={`text-right font-mono font-medium ${c.currentBalance > 0 ? "text-red-600" : "text-foreground"}`}>
                    {c.currentBalance > 0 ? formatCurrency(Number(c.currentBalance)) : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDateShort(c.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => {}}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      {c.id !== 1 && (
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
