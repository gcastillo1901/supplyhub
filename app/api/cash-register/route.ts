import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const [currentRegister, history] = await Promise.all([
    prisma.cashRegister.findFirst({
      where: { status: 'open' },
      include: { movements: true },
      orderBy: { openingDate: 'desc' }
    }),
    prisma.cashRegister.findMany({
      where: { status: 'closed' },
      orderBy: { closingDate: 'desc' },
      take: 10
    })
  ])

  return NextResponse.json({ currentRegister, history })
}

export async function POST(request: Request) {
  const { action, data } = await request.json()

  if (action === 'open') {
    const register = await prisma.cashRegister.create({
      data: {
        openingDate: new Date(),
        openingAmount: data.amount,
        status: 'open'
      }
    })
    return NextResponse.json(register)
  }

  if (action === 'close') {
    const register = await prisma.cashRegister.findFirst({
      where: { status: 'open' },
      include: { movements: true }
    })

    if (!register) {
      return NextResponse.json({ error: 'No hay caja abierta' }, { status: 400 })
    }

    const totalIncome = register.movements
      .filter(m => m.movementType === 'income')
      .reduce((sum, m) => sum + Number(m.amount), 0)
    
    const totalExpense = register.movements
      .filter(m => m.movementType === 'expense')
      .reduce((sum, m) => sum + Number(m.amount), 0)

    const expectedAmount = Number(register.openingAmount) + totalIncome - totalExpense
    const difference = data.closingAmount - expectedAmount

    const updated = await prisma.cashRegister.update({
      where: { id: register.id },
      data: {
        closingDate: new Date(),
        closingAmount: data.closingAmount,
        difference,
        status: 'closed'
      }
    })

    return NextResponse.json(updated)
  }

  if (action === 'movement') {
    const register = await prisma.cashRegister.findFirst({
      where: { status: 'open' }
    })

    if (!register) {
      return NextResponse.json({ error: 'No hay caja abierta' }, { status: 400 })
    }

    const movement = await prisma.cashMovement.create({
      data: {
        cashRegisterId: register.id,
        movementType: data.type,
        description: data.description,
        amount: data.amount,
        movementDate: new Date()
      }
    })

    return NextResponse.json(movement)
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
}
