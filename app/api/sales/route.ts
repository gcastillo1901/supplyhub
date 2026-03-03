import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const sales = await prisma.sale.findMany({
    include: { 
      customer: true,
      details: {
        include: {
          product: true
        }
      }
    },
    orderBy: { saleDate: 'desc' },
    take: 50
  })

  return NextResponse.json(sales)
}

export async function POST(request: Request) {
  const { customerId, paymentMethod, subtotal, tax, total, details } = await request.json()

  const sale = await prisma.sale.create({
    data: {
      customerId,
      saleDate: new Date(),
      subtotal,
      tax,
      total,
      paymentMethod,
      status: 'paid',
      details: {
        create: details.map((d: any) => ({
          productId: d.productId,
          quantity: d.quantity,
          salePrice: d.unitPrice,
          subtotal: d.subtotal
        }))
      }
    }
  })

  return NextResponse.json(sale)
}
