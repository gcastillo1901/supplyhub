import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [todaySales, lowStockProducts, cashRegister] = await Promise.all([
    prisma.sale.findMany({
      where: {
        saleDate: { gte: today },
        status: 'paid'
      }
    }),
    prisma.product.findMany({
      where: {
        stock: { lte: prisma.product.fields.minimumStock }
      },
      include: { category: true }
    }),
    prisma.cashRegister.findFirst({
      where: { status: 'open' },
      orderBy: { openingDate: 'desc' }
    })
  ])

  const todayRevenue = todaySales.reduce((acc, s) => acc + Number(s.total), 0)

  return NextResponse.json({
    todaySalesCount: todaySales.length,
    todayRevenue,
    lowStockCount: lowStockProducts.length,
    lowStockProducts: lowStockProducts.slice(0, 8),
    cashRegister: cashRegister ? {
      openingAmount: Number(cashRegister.openingAmount),
      status: cashRegister.status
    } : null
  })
}
