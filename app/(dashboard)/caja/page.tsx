"use client"

import { useState, useEffect } from "react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Lock, Unlock, Plus, TrendingUp, TrendingDown, History } from "lucide-react"

export default function CajaPage() {
  const [cashRegister, setCashRegister] = useState<any>(null)
  const [cashHistory, setCashHistory] = useState<any[]>([])
  const [openingAmount, setOpeningAmount] = useState("")
  const [closingAmount, setClosingAmount] = useState("")
  const [movementType, setMovementType] = useState<"income" | "expense">("income")
  const [movementAmount, setMovementAmount] = useState("")
  const [movementDescription, setMovementDescription] = useState("")
  const [openDialogOpen, setOpenDialogOpen] = useState(false)
  const [closeDialogOpen, setCloseDialogOpen] = useState(false)
  const [movementDialogOpen, setMovementDialogOpen] = useState(false)

  const loadData = () => {
    fetch('/api/cash-register')
      .then(res => res.json())
      .then(data => {
        setCashRegister(data.currentRegister)
        setCashHistory(data.history)
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  const totalIncome = cashRegister?.movements?.filter((m: any) => m.movementType === "income").reduce((a: number, m: any) => a + Number(m.amount), 0) ?? 0
  const totalExpense = cashRegister?.movements?.filter((m: any) => m.movementType === "expense").reduce((a: number, m: any) => a + Number(m.amount), 0) ?? 0
  const expectedAmount = cashRegister ? Number(cashRegister.openingAmount) + totalIncome - totalExpense : 0

  async function handleOpenRegister() {
    const amount = Number.parseFloat(openingAmount)
    if (Number.isNaN(amount) || amount < 0) return
    await fetch('/api/cash-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'open', data: { amount } })
    })
    setOpeningAmount("")
    setOpenDialogOpen(false)
    loadData()
  }

  async function handleCloseRegister() {
    const amount = Number.parseFloat(closingAmount)
    if (Number.isNaN(amount) || amount < 0) return
    await fetch('/api/cash-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'close', data: { closingAmount: amount } })
    })
    setClosingAmount("")
    setCloseDialogOpen(false)
    loadData()
  }

  async function handleAddMovement() {
    const amount = Number.parseFloat(movementAmount)
    if (Number.isNaN(amount) || amount <= 0 || !movementDescription.trim()) return
    await fetch('/api/cash-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'movement',
        data: {
          type: movementType,
          amount,
          description: movementDescription.trim()
        }
      })
    })
    setMovementAmount("")
    setMovementDescription("")
    setMovementDialogOpen(false)
    loadData()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Caja</h1>
          <p className="text-muted-foreground">Control de apertura, cierre y movimientos de efectivo</p>
        </div>
        <div className="flex gap-2">
          {cashRegister ? (
            <>
              <Dialog open={movementDialogOpen} onOpenChange={setMovementDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 size-4" />
                    Movimiento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Movimiento</DialogTitle>
                    <DialogDescription>Agregue un ingreso o egreso manual a la caja</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select value={movementType} onValueChange={(v) => setMovementType(v as "income" | "expense")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Ingreso</SelectItem>
                          <SelectItem value="expense">Egreso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Monto (C$)</Label>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        value={movementAmount}
                        onChange={(e) => setMovementAmount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descripcion</Label>
                      <Textarea
                        placeholder="Motivo del movimiento..."
                        value={movementDescription}
                        onChange={(e) => setMovementDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setMovementDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddMovement}>Registrar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Lock className="mr-2 size-4" />
                    Cerrar Caja
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cerrar Caja</DialogTitle>
                    <DialogDescription>
                      Monto esperado: <span className="font-bold text-foreground">{formatCurrency(expectedAmount)}</span>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Monto Contado (C$)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={closingAmount}
                        onChange={(e) => setClosingAmount(e.target.value)}
                      />
                    </div>
                    {closingAmount && (
                      <div className="rounded-lg border p-3">
                        <p className="text-sm text-muted-foreground">Diferencia:</p>
                        <p className={`text-lg font-bold ${Number.parseFloat(closingAmount) - expectedAmount >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {formatCurrency(Number.parseFloat(closingAmount) - expectedAmount)}
                        </p>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCloseDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleCloseRegister}>Cerrar Caja</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Dialog open={openDialogOpen} onOpenChange={setOpenDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Unlock className="mr-2 size-4" />
                  Abrir Caja
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Abrir Caja</DialogTitle>
                  <DialogDescription>Ingrese el monto inicial para apertura de caja</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Monto de Apertura (C$)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={openingAmount}
                      onChange={(e) => setOpeningAmount(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleOpenRegister}>Abrir Caja</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Status cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            {cashRegister ? <Unlock className="size-4 text-emerald-600" /> : <Lock className="size-4 text-muted-foreground" />}
          </CardHeader>
          <CardContent>
            <Badge variant={cashRegister ? "default" : "secondary"} className={cashRegister ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}>
              {cashRegister ? "Abierta" : "Cerrada"}
            </Badge>
            {cashRegister && (
              <p className="mt-1 text-xs text-muted-foreground">Desde {formatDate(cashRegister.openingDate)}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo Esperado</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(expectedAmount)}</div>
            <p className="text-xs text-muted-foreground">Apertura: {formatCurrency(cashRegister?.openingAmount ?? 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <TrendingUp className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">{cashRegister?.movements?.filter((m: any) => m.movementType === "income").length ?? 0} movimientos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Egresos</CardTitle>
            <TrendingDown className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</div>
            <p className="text-xs text-muted-foreground">{cashRegister?.movements?.filter((m: any) => m.movementType === "expense").length ?? 0} movimientos</p>
          </CardContent>
        </Card>
      </div>

      {/* Movements table */}
      {cashRegister && (
        <Card>
          <CardHeader>
            <CardTitle>Movimientos del Dia</CardTitle>
            <CardDescription>Listado de ingresos y egresos de la caja actual</CardDescription>
          </CardHeader>
          <CardContent>
            {cashRegister.movements.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No hay movimientos registrados</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripcion</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...cashRegister.movements].reverse().map((m: any) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        {m.movementType === "income" ? (
                          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                            <ArrowUpCircle className="mr-1 size-3" />
                            Ingreso
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
                            <ArrowDownCircle className="mr-1 size-3" />
                            Egreso
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{m.description}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(m.movementDate)}</TableCell>
                      <TableCell className={`text-right font-mono font-medium ${m.movementType === "income" ? "text-emerald-600" : "text-red-600"}`}>
                        {m.movementType === "income" ? "+" : "-"}{formatCurrency(Number(m.amount))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cash history */}
      {cashHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="size-5 text-muted-foreground" />
              <div>
                <CardTitle>Historial de Cierres</CardTitle>
                <CardDescription>Registro de cierres de caja anteriores</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Apertura</TableHead>
                  <TableHead>Cierre</TableHead>
                  <TableHead className="text-right">Monto Apertura</TableHead>
                  <TableHead className="text-right">Esperado</TableHead>
                  <TableHead className="text-right">Contado</TableHead>
                  <TableHead className="text-right">Diferencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...cashHistory].reverse().map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-muted-foreground">{formatDate(r.openingDate)}</TableCell>
                    <TableCell className="text-muted-foreground">{r.closingDate ? formatDate(r.closingDate) : "-"}</TableCell>
                    <TableCell className="text-right font-mono text-foreground">{formatCurrency(Number(r.openingAmount))}</TableCell>
                    <TableCell className="text-right font-mono text-foreground">{formatCurrency(Number(r.openingAmount))}</TableCell>
                    <TableCell className="text-right font-mono text-foreground">{formatCurrency(Number(r.closingAmount ?? 0))}</TableCell>
                    <TableCell className={`text-right font-mono font-medium ${Number(r.difference ?? 0) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {formatCurrency(Number(r.difference ?? 0))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
